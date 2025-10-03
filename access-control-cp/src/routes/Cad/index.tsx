import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios'; 

const API_URL = 'http://localhost:3001/usuarios';

const cadastroAcessar = z.object({
    nomeUsuario: z
    .string()
    .min(1, 'O nome de usuário é obrigatório.'),

    email: z
    .string()
    .min(1, 'O e-mail é obrigatório.')
    .email('Formato de e-mail inválido.'),
    
});

type CadastroFormData = z.infer<typeof cadastroAcessar>;

export default function Cadastro() {
    const navigate = useNavigate(); 
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const {
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
    } = useForm<CadastroFormData>({
        resolver: zodResolver(cadastroAcessar), 
    }); 

    const onSubmit = async (data: CadastroFormData) => {
        setErrorMessage(''); 
        setSuccessMessage('');

        try {
            const check_url = `${API_URL}?email=${data.email}`;
            const existingUser = await axios.get(check_url);

            if (existingUser.data.length > 0) {
                setErrorMessage('Este e-mail já está em uso. Tente fazer login ou use outro e-mail.');
                return; 
            }

            const response = await axios.post(API_URL, data);

            if (response.status === 201) {
                
                setSuccessMessage('Cadastro realizado com sucesso! Redirecionando para a página de Login...');

                setTimeout(() => {
                    navigate('/'); 
                }, 1500);

            } else {
                setErrorMessage('Erro ao registrar. Tente novamente.');
            }

        } catch (error) {
            console.error('Erro no cadastro:', error);
            setErrorMessage('Ocorreu um erro na conexão. Tente novamente mais tarde.');
        }
    };

    return (
        <main>
            <div>
                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                >
                    <h1>Crie sua Conta</h1>

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
                            placeholder="Escolha seu nome de usuário"
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
                        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                    </button>

                    <p>
                        Já tem uma conta?{' '}
                        <Link to="/">Fazer Login</Link>
                    </p>

                </form>
            </div>
        </main>
    )
}
