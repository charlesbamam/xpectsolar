'use client';

import styles from './admin.module.css';

export default function AdminDashboard() {
    const users = [
        { id: 1, name: 'Carlos Consultor', email: 'carlos@solarxpect.com', plan: 'Pro', status: 'Ativo', totalScans: 145 },
        { id: 2, name: 'João Integrador', email: 'joao@solucoes.com', plan: 'Team', status: 'Ativo', totalScans: 890 },
        { id: 3, name: 'Maria Vendas', email: 'maria@vendasolar.br', plan: 'Starter', status: 'Cancelado', totalScans: 12 },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Gerenciamento de Usuários</h2>
                <div className={styles.actions}>
                    <input type="text" placeholder="Buscar usuário por email ou nome..." className={styles.searchInput} />
                    <button className={styles.filterBtn}>Filtros</button>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total de Usuários</h3>
                    <p className={styles.statNumber}>1,248</p>
                    <span className={styles.trendUp}>+12% este mês</span>
                </div>
                <div className={styles.statCard}>
                    <h3>Varreduras Totais</h3>
                    <p className={styles.statNumber}>45,892</p>
                    <span className={styles.trendUp}>+24% este mês</span>
                </div>
                <div className={styles.statCard}>
                    <h3>Receita (MRR)</h3>
                    <p className={styles.statNumber}>R$ 18.450</p>
                    <span className={styles.trendUp}>+8% este mês</span>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Plano Atual</th>
                            <th>Status</th>
                            <th>Total Varreduras</th>
                            <th>Ações Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className={styles.idCell}>#{user.id}</td>
                                <td>
                                    <div className={styles.clientInfo}>
                                        <strong>{user.name}</strong>
                                        <span>{user.email}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={styles[`plan${user.plan}`] || styles.planDefault}>
                                        {user.plan}
                                    </span>
                                </td>
                                <td>
                                    <span className={user.status === 'Ativo' ? styles.statusActive : styles.statusCancelled}>
                                        {user.status}
                                    </span>
                                </td>
                                <td><strong>{user.totalScans}</strong></td>
                                <td>
                                    <div className={styles.rowActions}>
                                        <button className={styles.actionBtn}>Editar Plano</button>
                                        <button className={styles.dangerBtn}>Logar como</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
