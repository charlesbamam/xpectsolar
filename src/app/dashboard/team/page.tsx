'use client';

import styles from './team.module.css';

export default function TeamDashboard() {
    const teamMembers = [
        { id: 1, name: 'Carlos Consultor', email: 'carlos@solarxpect.com', role: 'Proprietário', status: 'Ativo', scans: 15 },
        { id: 2, name: 'Ana Silva', email: 'ana@solarxpect.com', role: 'Membro', status: 'Ativo', scans: 12 },
        { id: 3, name: 'João Santos', email: 'joao@solarxpect.com', role: 'Membro', status: 'Convite Pendente', scans: 0 },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2>Gerenciar Equipe</h2>
                    <p>Adicione ou remova membros da sua equipe e acompanhe o uso do plano.</p>
                </div>
                <button className={styles.inviteBtn}>+ Convidar Membro</button>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Membros</h3>
                    <p className={styles.statNumber}>3 <span>/ 5</span></p>
                </div>
                <div className={styles.statCard}>
                    <h3>Varreduras da Equipe</h3>
                    <p className={styles.statNumber}>27 <span>/ 200</span></p>
                </div>
                <div className={styles.statCard}>
                    <h3>Renovação</h3>
                    <p className={styles.statNumber}>15 Dias</p>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Função</th>
                            <th>Status</th>
                            <th>Varreduras no Mês</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.map((member) => (
                            <tr key={member.id}>
                                <td><strong>{member.name}</strong></td>
                                <td>{member.email}</td>
                                <td>
                                    <span className={member.role === 'Proprietário' ? styles.badgeOwner : styles.badgeMember}>
                                        {member.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={member.status === 'Ativo' ? styles.statusActive : styles.statusPending}>
                                        {member.status}
                                    </span>
                                </td>
                                <td>{member.scans}</td>
                                <td>
                                    {member.role !== 'Proprietário' && (
                                        <button className={styles.removeBtn}>Remover</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
