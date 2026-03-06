export default function Page() {    
    return(
        <main className = "min-h-screen bg-background relative flex flex-col justify-center">
            <div className = "text-center space-y-6">
                <h1 className = "text-5xl font-bold text-foreground">Your guest has been notified</h1>
                <p className = "text-2xl text-muted-foreground">They are on their way</p>
            </div>
        </main> 
    )
}