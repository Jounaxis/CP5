import { useState, } from 'react';
import { useNavigate, Link, } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios'; 

const API_URL = 'http://localhost:3001/usuarios';

const loginAcessar = z.object({
    nomeUsuario: z
    .string()
    .min(1, 'O nome de usuário é obrigatório.'),

    email: z
    .string()
    .min(1, 'O e-mail é obrigatório.')
    .email('Formato de e-mail inválido.'),
    
});

type LoginFormData = z.infer<typeof loginAcessar>;

export default function Login() {
    const navigate = useNavigate(); 
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const {
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginAcessar), 
    }); 

    const onSubmit = async (data: LoginFormData) => {
        setErrorMessage(''); 
        setSuccessMessage('');

        try {
            const login_url = `${API_URL}?nomeUsuario=${data.nomeUsuario}&email=${data.email}`;
            
            const response = await axios.get(login_url);

            if (response.data.length > 0) {
                
                localStorage.setItem('userToken', 'simulated_user_token_123'); 
                
                setSuccessMessage('Login realizado com sucesso! Redirecionando para a Home...');

                setTimeout(() => {
                    navigate('/home'); 
                }, 1500);

            } else {
                setErrorMessage('Conta não existe ou credenciais inválidas. Verifique os dados.');
            }

        } catch (error) {
            console.error('Erro no login:', error);
            setErrorMessage('Ocorreu um erro na conexão. Tente novamente mais tarde.');
        }
    };

    return (
        <main>
            <div>
                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                >
                    <h1>Acesso Restrito</h1>

                    {successMessage && (
                        <div>{successMessage}</div>
                    )}
                    {errorMessage && (
                        <div>{errorMessage}</div>
                    )}

                    <div>
                        <label htmlFor="nomeUsuario">
                            Nome de Usuário
                        </label>
                        <input
                            id="nomeUsuario"
                            type="text"
                            {...register('nomeUsuario')} 
                            placeholder="Seu nome de usuário"
                            />
                        {errors.nomeUsuario && (
                            <p style={{ color: 'red' }}> {errors.nomeUsuario.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')} 
                            placeholder="seu@email.com"
                            />
                        {errors.email && (<p style={{ color: 'red' }}> {errors.email.message}</p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className={isSubmitting ? 'submit-button submitting' : 'submit-button'}
                            >
                        {isSubmitting ? 'Verificando Credenciais...' : 'Acessar'}
                    </button>

                    <p>
                        Não tem uma conta?{' '}
                        <Link to="/cadastro">Cadastre-se aqui</Link>
                    </p>

                </form>
            </div>
        </main>
    )
}
