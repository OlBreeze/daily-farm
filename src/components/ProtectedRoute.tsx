// layout.tsx - Layout для защищенных страниц
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AccountLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div>
                {/* Общий layout для аккаунта */}
                <nav>
                    {/* Навигация */}
                </nav>
                <main>{children}</main>
            </div>
        </ProtectedRoute>
    );
}