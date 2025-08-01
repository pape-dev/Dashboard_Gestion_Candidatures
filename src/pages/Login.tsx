import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <AuthLayout
      title="Connexion"
      subtitle="Accédez à votre tableau de bord professionnel"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;