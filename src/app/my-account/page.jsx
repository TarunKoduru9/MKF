"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Heart, FileText, HelpCircle, LogOut, ChevronRight, PenSquare, Download, Loader2 } from "lucide-react";
import useStore from "@/lib/store";
import { useRouter } from "next/navigation";
import { API_ROUTES } from "@/lib/routes";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export default function MyAccountPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const setUser = useStore((state) => state.setUser);
    const logout = useStore((state) => state.logout);
    const router = useRouter();
    const { toast } = useToast();

    // Fetch User Data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(API_ROUTES.AUTH.ME);
                setProfile(res.data.user);
                setUser(res.data.user); // Sync global store
            } catch (error) {
                console.error("Auth Error:", error);
                // If 401, redirect to login
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router, setUser]);

    const handleLogout = async () => {
        logout();
        router.push("/login"); // Redirect to Login page actually
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) return null; // Or handled by redirect

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileSection user={profile} />;
            case "donations":
                return <DonationsSection />;
            // ... other cases
            default:
                return <ProfileSection user={profile} />;
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Account</h1>
                        <p className="text-muted-foreground mt-1">Welcome back, {profile.name}!</p>
                    </div>
                    <Button variant="destructive" onClick={handleLogout} className="w-fit">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Sidebar */}
                    <div className="lg:col-span-3 space-y-4">
                        <NavCard
                            icon={User}
                            title="My Profile"
                            isActive={activeTab === "profile"}
                            onClick={() => setActiveTab("profile")}
                        />
                        {/* Repeats... */}
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        {renderContent()}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function NavCard({ icon: Icon, title, isActive, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${isActive
                ? "bg-white border-red-200 shadow-md ring-1 ring-red-100"
                : "bg-white border-transparent hover:bg-slate-50"
                }`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isActive ? "bg-red-50 text-primary" : "bg-slate-100 text-slate-500"}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <span className={`font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>{title}</span>
            </div>
            {isActive && <ChevronRight className="h-4 w-4 text-primary" />}
        </div>
    );
}

function ProfileSection({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ ...user });
    const { toast } = useToast();
    const router = useRouter();

    // Update local state when user prop changes (e.g. initial load)
    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.post(API_ROUTES.USER, {
                ...formData,
                uid: user.uid // Ensure UID is sent for identification
            });
            toast({ title: "Success", description: "Profile updated successfully." });
            setIsEditing(false);
            // Optional: Trigger a refresh or just rely on local update since we updated optimistic
            router.refresh();
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "Failed to update profile." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-2xl font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <CardTitle className="text-xl">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                </div>
                {!isEditing ? (
                    <Button size="sm" onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90">
                        <PenSquare className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <ProfileField
                        label="Name"
                        name="name"
                        value={formData.name}
                        isEditing={isEditing}
                        onChange={handleChange}
                    />
                    <ProfileField
                        label="Email"
                        name="email"
                        value={formData.email}
                        isEditing={false} // Email typically not editable
                        disabled={true}
                    />
                    <ProfileField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        isEditing={isEditing}
                        onChange={handleChange}
                    />
                    <ProfileField
                        label="Address"
                        name="address"
                        value={formData.address_line || formData.address} // Handle both naming conventions if any
                        isEditing={isEditing}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value, address_line: e.target.value })}
                    />
                    <ProfileField
                        label="District"
                        name="district"
                        value={formData.district}
                        isEditing={isEditing}
                        onChange={handleChange}
                    />
                    <ProfileField
                        label="State"
                        name="state"
                        value={formData.state}
                        isEditing={isEditing}
                        onChange={handleChange}
                    />
                    <ProfileField
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        isEditing={isEditing}
                        onChange={handleChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function ProfileField({ label, name, value, isEditing, onChange, disabled }) {
    return (
        <div className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground">{label}:</span>
            {isEditing && !disabled ? (
                <Input
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className="h-10 border-slate-200"
                />
            ) : (
                <div className={`p-3 rounded-md border text-sm font-medium ${disabled ? "bg-slate-100 border-slate-100 text-slate-500" : "bg-slate-50 border-slate-100"}`}>
                    {value || "Not set"}
                </div>
            )}
        </div>
    );
}

function DonationsSection() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await axios.get("/api/donations");
                setDonations(res.data.donations || []);
            } catch (error) {
                console.error("Failed to fetch donations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (donations.length === 0) {
        return (
            <Card className="border-0 shadow-sm min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-primary">
                        <Heart className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold">No Donations Yet</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Your generous contributions will appear here. Start making a difference today!
                    </p>
                    <Button onClick={() => window.location.href = '/donate'}>Donate Now</Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle>My Donation History</CardTitle>
                <CardDescription>Thank you for supporting our cause.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Purpose</th>
                                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Order ID</th>
                                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Amount</th>
                                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((d) => (
                                <tr key={d.id} className="border-b transition-colors hover:bg-slate-50/50">
                                    <td className="p-4 align-middle">
                                        {new Date(d.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 align-middle font-medium">{d.purpose}</td>
                                    <td className="p-4 align-middle text-muted-foreground font-mono text-xs">{d.order_id}</td>
                                    <td className="p-4 align-middle font-bold text-green-600">
                                        ₹{d.amount}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${d.payment_status === 'success' ? 'bg-green-100 text-green-800' :
                                                d.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {d.payment_status.charAt(0).toUpperCase() + d.payment_status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

function CertificatesSection() {
    return (
        <Card className="border-0 shadow-sm min-h-[400px] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-500">
                    <Download className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold">No Certificates Available</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Certificates for your donations and volunteering will be available for download here.
                </p>
            </div>
        </Card>
    );
}

function SupportSection() {
    return (
        <div className="space-y-6">
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>We are here to help you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input placeholder="your@email.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input placeholder="Your phone number" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <textarea className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="How can we help you?"></textarea>
                    </div>
                    <Button className="w-full">Send Message</Button>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                            <h4 className="font-semibold text-sm mb-2">How can I download my 80G certificate?</h4>
                            <p className="text-xs text-muted-foreground">You can download your tax exemption certificate from the 'Download Certificates' section after 24-48 hours of your donation.</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
