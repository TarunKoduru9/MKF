# 🚀 VPS Deployment Guide - WhatsApp Chatbot

Complete guide to deploy your Next.js WhatsApp chatbot to your VPS with custom domain.

---

## 📋 Prerequisites

- ✅ VPS server (Ubuntu 20.04+ recommended)
- ✅ Domain name pointed to your VPS IP
- ✅ SSH access to your VPS
- ✅ Node.js 18+ installed
- ✅ MySQL 8+ installed
- ✅ Nginx installed

---

## 1️⃣ Server Setup

### Connect to Your VPS

```bash
ssh root@your-server-ip
```

### Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js (if not installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should be v20+
```

### Install MySQL (if not installed)

```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

---

## 2️⃣ Database Setup

### Create Database

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE aroratech_chatbot;
CREATE USER 'chatbot_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON aroratech_chatbot.* TO 'chatbot_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Import Schema

```bash
mysql -u chatbot_user -p aroratech_chatbot < /path/to/schema.sql
```

Or manually:

```sql
USE aroratech_chatbot;

CREATE TABLE form_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  requirement TEXT NOT NULL,
  address TEXT,
  userNumber VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_userNumber (userNumber),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3️⃣ Deploy Application

### Clone Your Project

```bash
cd /var/www
sudo mkdir aroratech-chatbot
sudo chown $USER:$USER aroratech-chatbot
cd aroratech-chatbot

# Upload your files via SCP or Git
# Option 1: Using Git
git clone https://github.com/yourusername/aroratech-chatbot.git .

# Option 2: Using SCP from local machine
# scp -r /path/to/arora-chatbot/* root@your-server-ip:/var/www/aroratech-chatbot/
```

### Install Dependencies

```bash
npm install
```

### Create Production Environment File

```bash
nano .env.local
```

Add:

```env
# WhatsApp Business API
WHATSAPP_TOKEN=your_actual_token
WHATSAPP_PHONE_NUMBER_ID=your_actual_phone_id
VERIFY_TOKEN=your_verify_token

# Database (Production)
DB_HOST=localhost
DB_USER=chatbot_user
DB_PASSWORD=your_secure_password
DB_NAME=aroratech_chatbot

# App Configuration (YOUR DOMAIN)
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### Build Application

```bash
npm run build
```

---

## 4️⃣ Setup PM2

### Start Application with PM2

```bash
pm2 start npm --name "aroratech-chatbot" -- start
pm2 save
pm2 startup
```

### Useful PM2 Commands

```bash
pm2 list              # List all processes
pm2 logs              # View logs
pm2 restart aroratech-chatbot
pm2 stop aroratech-chatbot
pm2 delete aroratech-chatbot
```

---

## 5️⃣ Nginx Configuration

### Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/aroratech-chatbot
```

Add:

```nginx
server {
    listen 80;
    server_name aroratech.space www.aroratech.space;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase body size for file uploads
    client_max_body_size 10M;
}
```

### Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/aroratech-chatbot /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

---

## 6️⃣ Setup SSL (HTTPS)

### Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Get SSL Certificate

```bash
sudo certbot --nginx -d aroratech.space -d www.aroratech.space
```

Follow the prompts:
- Enter email address
- Agree to terms
- Choose redirect HTTP to HTTPS (option 2)

### Auto-Renewal Test

```bash
sudo certbot renew --dry-run
```

Certbot will auto-renew certificates before they expire.

---

## 7️⃣ Configure WhatsApp Webhook

### Update Meta Developer Console

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Select your app → **WhatsApp** → **Configuration**
3. Under **Webhook**, click **Edit**
4. Enter:
   - **Callback URL**: `https://yourdomain.com/api/webhook`
   - **Verify Token**: Same as your `.env.local` VERIFY_TOKEN
5. Click **Verify and Save**
6. Subscribe to **messages** field

---

## 8️⃣ Firewall Setup

### Configure UFW

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## 9️⃣ Monitoring & Logs

### View Application Logs

```bash
pm2 logs aroratech-chatbot
pm2 logs aroratech-chatbot --lines 100
```

### View Nginx Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Monitor Server Resources

```bash
pm2 monit
htop  # Install: sudo apt install htop
```

---

## 🔟 Testing

### Test Landing Page

```bash
curl https://yourdomain.com
```

### Test Webhook

```bash
curl "https://yourdomain.com/api/webhook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test123"
# Should return: test123
```

### Test WhatsApp Bot

1. Add your test number in Meta Console
2. Send "Hi" to business WhatsApp number
3. You should receive interactive menu! 🎉

---

## 🔄 Update/Redeploy

When you make changes:

```bash
cd /var/www/aroratech-chatbot
git pull  # or upload new files
npm install
npm run build
pm2 restart aroratech-chatbot
```

---

## 🐛 Troubleshooting

### Bot Not Responding?

**Check PM2 logs:**
```bash
pm2 logs aroratech-chatbot
```

**Check if app is running:**
```bash
pm2 list
curl http://localhost:3000
```

**Restart app:**
```bash
pm2 restart aroratech-chatbot
```

### Database Connection Error?

**Check MySQL is running:**
```bash
sudo systemctl status mysql
```

**Test database connection:**
```bash
mysql -u chatbot_user -p aroratech_chatbot
```

**Check credentials in `.env.local`**

### Nginx 502 Bad Gateway?

**Check if Next.js is running:**
```bash
pm2 list
curl http://localhost:3000
```

**Check Nginx config:**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Certificate Issues?

**Renew certificate:**
```bash
sudo certbot renew
sudo systemctl restart nginx
```

---

## 📊 Performance Optimization

### Enable Gzip in Nginx

Edit `/etc/nginx/nginx.conf`:

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### Setup Caching

Add to Nginx config:

```nginx
location /_next/static {
    proxy_pass http://localhost:3000;
    proxy_cache_valid 60m;
    add_header Cache-Control "public, immutable";
}
```

---

## 🔐 Security Best Practices

### Change Default MySQL Port

Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:
```
port = 3307  # Change from default 3306
```

### Use Strong Passwords

```bash
# Generate strong password
openssl rand -base64 32
```

### Disable Root SSH Login

Edit `/etc/ssh/sshd_config`:
```
PermitRootLogin no
```

### Setup Fail2Ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

---

## 📝 Backup Strategy

### Backup Database Daily

Create cron job:

```bash
crontab -e
```

Add:

```cron
0 2 * * * mysqldump -u chatbot_user -p'your_password' aroratech_chatbot > /backups/chatbot_$(date +\%Y\%m\%d).sql
```

### Backup Application Files

```bash
tar -czf /backups/app_$(date +%Y%m%d).tar.gz /var/www/aroratech-chatbot
```

---

## ✅ Post-Deployment Checklist

- [ ] Application builds successfully
- [ ] PM2 running and auto-starts on reboot
- [ ] Nginx configured and running
- [ ] SSL certificate installed and valid
- [ ] Domain points to correct IP
- [ ] Database connected and schema created
- [ ] WhatsApp webhook verified in Meta Console
- [ ] Test message flow works end-to-end
- [ ] Form submission saves to database
- [ ] WhatsApp confirmation messages sent
- [ ] Firewall configured
- [ ] Monitoring setup (PM2 logs)
- [ ] Backup strategy implemented

---

## 🎉 You're Live!

Your WhatsApp chatbot is now running on:
- 🌐 **Website**: https://yourdomain.com
- 📝 **Requirement Form**: https://yourdomain.com/requirement
- 🤖 **Webhook**: https://yourdomain.com/api/webhook

**Test it by sending "Hi" to your WhatsApp Business number!**

---

## 📞 Support

For any deployment issues, refer to:
- PM2 Docs: https://pm2.keymetrics.io/
- Nginx Docs: https://nginx.org/en/docs/
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**Happy Deploying! 🚀**
