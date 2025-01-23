const AuthLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="h-screen bg-gray-50 w-full">
            <div className="flex items-center justify-center h-full">{children}</div>
        </div>
    )
}

export default AuthLayout
