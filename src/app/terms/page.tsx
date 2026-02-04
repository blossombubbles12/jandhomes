import { PremiumNavbar } from "@/components/public/premium/PremiumNavbar";
import { PremiumFooter } from "@/components/public/premium/PremiumFooter";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Use | Jand Homes Properties",
    description: "The legal terms and conditions governing the use of Jand Homes Properties services and website.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <PremiumNavbar />

            <div className="pt-48 pb-24 border-b border-border">
                <div className="container mx-auto px-6">
                    <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-8 text-center md:text-left">Terms of Use</h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Effective Date: February 3, 2026</p>
                </div>
            </div>

            <section className="py-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="prose prose-slate dark:prose-invert prose-lg max-w-none space-y-12 text-muted-foreground font-light">
                        <div>
                            <h2 className="font-serif text-3xl text-foreground mb-6">1. Agreement to Terms</h2>
                            <p className="leading-relaxed">
                                By accessing or using the Jand Homes Properties website (the "Site") and our services, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-serif text-3xl text-foreground mb-6">2. Intellectual Property Rights</h2>
                            <p className="leading-relaxed">
                                The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary rights. The copying, redistribution, use or publication by you of any such matters or any part of the Site is strictly prohibited without our express written permission.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-serif text-3xl text-foreground mb-6">3. Professional Disclaimer</h2>
                            <p className="leading-relaxed">
                                The information provided on this Site is for general informational purposes only and does not constitute professional advice. While we strive for accuracy, Jand Homes Properties makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the property listings or services described.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-serif text-3xl text-foreground mb-6">4. Limitation of Liability</h2>
                            <p className="leading-relaxed">
                                In no event shall Jand Homes Properties or its directors, employees, or agents be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-serif text-3xl text-foreground mb-6">5. Governing Law</h2>
                            <p className="leading-relaxed">
                                These terms and conditions are governed by and construed in accordance with the laws of the Federal Republic of Nigeria and you irrevocably submit to the exclusive jurisdiction of the courts in Lagos State.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-serif text-3xl text-foreground mb-6">6. Changes to Terms</h2>
                            <p className="leading-relaxed">
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Site after those revisions become effective, you agree to be bound by the revised terms.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <PremiumFooter />
        </main>
    );
}
