export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div className="footer-brand">
                    <h3>🐾 Conecta Patas</h3>
                    <p>Conectando animais que precisam de amor a pessoas que têm amor para dar.</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Conecta Patas. Produzido por <strong>Vision Web</strong>.</p>
            </div>
        </footer>
    );
}