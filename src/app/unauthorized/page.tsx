import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="max-w-md w-full border-red-200 dark:border-red-900 shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-500">Access Denied</CardTitle>
                    <CardDescription className="text-base mt-2">
                        You do not have permission to access this page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        This area is restricted to administrators or specific roles. If you believe this is an error, please contact your system administrator.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button asChild variant="outline">
                        <Link href="/login">Switch Account</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/dashboard">Go to Dashboard</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
