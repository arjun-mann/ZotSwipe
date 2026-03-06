import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function Page() {
    return(
        <main className = "min-h-screen bg-background relative flex flex-col justify-center">
            <div className = "text-center space-y-6">
                <h1 className = "text-5xl font-bold text-foreground">Your seller will be with you shortly!</h1>
                <p className = "text-2xl text-muted-foreground">Thank you!</p>
                <Link href="/">
                    <Button size="lg">
                        Return to home
                    </Button>
                </Link>
            </div>
        </main>
    )
}