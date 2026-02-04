import { PremiumNavbar } from "@/components/public/premium/PremiumNavbar";
import { PremiumFooter } from "@/components/public/premium/PremiumFooter";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Jand Homes Properties",
    description: "Our commitment to protecting your privacy and personal data at Jand Homes Properties.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <PremiumNavbar />

            <div className="pt-48 pb-24 border-b border-border">
                <div className="container mx-auto px-6">
                    <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-8 text-center md:text-left">Privacy Policy</h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Last Updated: February 3, 2026</p>
                </div>
            </div>

            <section className="py-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="prose prose-slate dark:prose-invert prose-lg max-w-none space-y-12">
                        <div>
                            <h2 className="font-serif text-3xl text-foreground mb-6">1. Introduction</h2>
                            <p className="text-muted-foreground font-light leading-relaxed">
                                At Jand Homes Properties ("we," "us," or "our"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy informs you how we look after your personal data when you visit our website (regardless of where you visit it from) and tells you about your privacy rights and how the law protects you.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-serif text-3xl text-foreground mb-6">2. The Data We Collect</h2>
                            <p className="text-muted-foreground font-light leading-relaxed mb-4">
                                Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-4 text-muted-foreground font-light">
                                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, and operating system.</li>
                                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-serif text-3xl text-foreground mb-6">3. How We Use Your Data</h2>
                            <p className="text-muted-foreground font-light leading-relaxed mb-4">
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-4 text-muted-foreground font-light">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal obligation.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-serif text-3xl text-foreground mb-6">4. Data Security</h2>
                            <p className="text-muted-foreground font-light leading-relaxed">
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-serif text-3xl text-foreground mb-6">5. Contact Details</h2>
                            <p className="text-muted-foreground font-light leading-relaxed">
                                If you have any questions about this privacy policy or our privacy practices, please contact us at hello@jandhomes.com or visit our office at Admiralty Way, Lekki Phase 1, Lagos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <PremiumFooter />
        </main>
    );
}
