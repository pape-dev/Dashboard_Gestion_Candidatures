import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <AuthLayout
      title="Créer un compte"
      subtitle="Rejoignez des milliers de professionnels qui optimisent leur recherche d'emploi"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;