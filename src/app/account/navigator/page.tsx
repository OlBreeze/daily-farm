import AccountClientNavigatorPage from "@/components/AccountClientNavigatorPage";
import LogoutButton from "@/components/buttons/LogoutButton";

const ClientNavPage = () => {
    return (
        <div>
            <AccountClientNavigatorPage/>

            <div>
                <h1>Навигатор (Защищенная страница)</h1>
                <p>Вы успешно авторизованы!</p>
                <LogoutButton className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-850 transition">Выйти из аккаунта</LogoutButton>
            </div>
        </div>
    );
};

export default ClientNavPage;