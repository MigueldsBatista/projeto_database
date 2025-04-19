import React, { useEffect, useState } from "react";
import { get } from 'lodash';
import { FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { Container } from "../../styles/GlobalStyles";
import { UserContainer, ProfilePicture} from './Styled';
import axios from "../../services/axios";
import { toast } from 'react-toastify';

export default function Profile() {
    const [user, setUser] = useState({});

    const userId = useSelector(state => state.auth.user.id);

    useEffect(() => {
        if (!userId) return;
        async function fetchData() {
            try {
                const response = await axios.get(`/users`);
                console.log('User data:', response.data);
                setUser(response.data);

            } catch (err) {
                const errorMsg = get(err, 'response.data.errors', ['Erro ao obter dados do usuário'])[0];
                toast.error(errorMsg);
                console.error('Error fetching user data:', err);
            }
        }
        fetchData();
    }, [userId]);
    return (
        <Container>
            <UserContainer>
                <div>
                    <ProfilePicture>
                        {get(user, 'FotoDePerfils[0].url', false) ? (
                            <img src={user.FotoDePerfils[0].url} />
                        ) : (
                            <FaUserCircle size={300} />
                        )}
                    </ProfilePicture>
                    <span><strong>Nome:</strong> {user.nome}</span>
                    <span><strong>Email:</strong> {user.email}</span>
                    <span><strong>Papel:</strong> {user.role}</span>
                </div>
            </UserContainer>
        </Container>
    );
}
