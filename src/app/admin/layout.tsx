import styles from './admin-layout.module.css';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layout}>
            <header className={styles.adminHeader}>
                <div className={styles.logo}>
                    <span className={styles.icon}>⚡</span>
                    <h1>SolarProspect <span>Admin</span></h1>
                </div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navItem}>Visão Geral</Link>
                    <Link href="/admin/users" className={`${styles.navItem} ${styles.active}`}>Usuários</Link>
                    <Link href="/admin/banners" className={styles.navItem}>Banners</Link>
                    <Link href="/admin/settings" className={styles.navItem}>Sistema</Link>
                </nav>
                <div className={styles.adminProfile}>
                    <span className={styles.badge}>Mestre</span>
                    Super Admin
                    <Link href="/login" className={styles.logoutBtn}>Sair</Link>
                </div>
            </header>

            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
