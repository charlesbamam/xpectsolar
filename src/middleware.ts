import { NextRequest, NextResponse } from 'next/server';

export const config = {
    // O middleware roda em todas as rotas, exceto nos arquivos estáticos (imagens, CSS, etc.)
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(req: NextRequest) {
    // Lê o cabeçalho de autorização padrão do navegador
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        const [user, pwd] = atob(authValue).split(':');

        // ---------- CREDENCIAIS PARA OS SEUS CONVIDADOS BATA -----------
        // Você pode alterar o usuário e a senha nesta linha abaixo:
        if (user === 'beta' && pwd === 'XbetaP3cT') {
            return NextResponse.next();
        }
    }

    // Se errar a senha ou cancelar, a tela de login nativa do navegador continuará pedindo.
    return new NextResponse('Área restrita de testes Xpect Solar. Insira as credenciais para acessar.', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Xpect Solar Preview"',
        },
    });
}
