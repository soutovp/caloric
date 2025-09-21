// Referências aos elementos do DOM do modal de perfil
const profileModal = document.getElementById('profile-modal');
const profileDisplay = document.getElementById('profile-display');
const editProfileForm = document.getElementById('edit-profile-form');

// Elementos de exibição
const profileNameDisplay = document.getElementById('profile-name-display');
const profileEmailDisplay = document.getElementById('profile-email-display');
const profileGenderDisplay = document.getElementById('profile-gender-display');
const profileObjectiveDisplay = document.getElementById('profile-objective-display');
const profileActivityLevelDisplay = document.getElementById('profile-activity-level-display');

// Elementos do formulário de edição
const editProfileNameInput = document.getElementById('edit-profile-name');
// Note: o email não é editável diretamente pelo formulário de perfil, mas pode ser exibido
const editProfileGenderSelect = document.getElementById('edit-profile-gender');
const editProfileObjectiveSelect = document.getElementById('edit-profile-objective');
const editProfileActivityLevelSelect = document.getElementById('edit-profile-activity-level');

// Botões
const openEditProfileBtn = document.getElementById('open-edit-profile-btn');
const cancelEditProfileBtn = document.getElementById('cancel-edit-profile-btn');


/**
 * Mapeia os valores de enum do backend para strings mais amigáveis para a UI.
 * @param {string} value - O valor do enum (ex: 'MALE', 'LOSE_WEIGHT').
 * @param {string} type - O tipo de valor ('gender', 'objective', 'activityLevel').
 * @returns {string} Uma string formatada para exibição.
 */
const formatValueForDisplay = (value, type) => {
    if(!value) return 'N/A'; // Not Applicable

    switch(type){
        case 'gender':
            return value === 'MALE' ? 'Masculino' : 'Feminino';
        case 'objective':
            if(value === 'LOSE_WEIGHT') return 'Perder Peso';
            if(value === 'MAINTAIN_WEIGHT') return 'Manter Peso';
            if(value === 'GAIN_MUSCLE') return 'Ganhar Massa Muscular';
            return value;
        case 'activityLevel':
            if(value === 'SEDENTARY') return 'Sedentário';
            if(value === 'LIGHTLY_ACTIVE') return 'Levemente Ativo';
            if(value === 'MODERATELY_ACTIVE') return 'Moderadamente Ativo';
            if(value === 'VERY_ACTIVE') return 'Muito Ativo';
            if(value === 'EXTRA_ACTIVE') return 'Etra Ativo';
            return value;
        default:
            return value;
    }
};

/**
 * Exibe os dados do utilizador no modal de perfil.
 * @param {object} user - Objeto do utilizador com { name, email, gender, objective, activityLevel }.
 */
export const displayUserProfile = (user) =>{
    if(!user) return;

    profileNameDisplay.textContent = user.name || 'Não definido';
    profileEmailDisplay.textContent = user.email || 'Não definido';
    profileGenderDisplay.textContent = formatValueForDisplay(user.gender, 'gender');
    profileObjectiveDisplay.textContent = formatValueForDisplay(user.objective, 'objective');
    profileActivityLevelDisplay.textContent = formatValueForDisplay(user.activityLevel || '');

    // Preenche o formulário de edição com os dados atuais
    editProfileNameInput.value = user.name || '';
    editProfileGenderSelect.value = user.gender || '';
    editProfileObjectiveSelect.value = user.objective || '';
    editProfileActivityLevelSelect.value = user.activityLevel || '';

    //Garante que o modo de exibição está ativo ao abrir o perfil
    profileDisplay.classList.remove('hidden');
    editProfileForm.classList.add('hidden');
};

/**
 * Configura os event listeners para os elementos da UI de perfil.
 * @param {object} callbacks - Objeto com as funções de callback para atualizar o perfil.
 * Ex: { onUpdateProfile: (profileData) => {} }
 */
export const setupProfileUI = (callbacks)=>{
    if(openEditProfileBtn){
        openEditProfileBtn.addEventListener('click', ()=>{
            profileDisplay.classList.add('hidden');
            editProfileForm.classList.remove('hidden');
        });
    }

    if(cancelEditProfileBtn){
        cancelEditProfileBtn.addEventListener('click', ()=>{
            //Reverter para a visualização, mantendo os dados exibidos
            profileDisplay.classList.remove('hidden');
            editProfileForm.classList.add('hidden');
            //Opcional: recarregar os dados originais no formulário se o utilizador cancelou a edição
        });
    }

    if(editProfileForm){
        editProfileForm.addEventListener('submit', async (event)=>{
            event.preventDefault();
            const updatedData = {
                name: editProfileNameInput.value,
                gender: editProfileGenderSelect.value,
                objective: editProfileObjectiveSelect.value,
                activityLevel: editProfileActivityLevelSelect.value,
            };
            await callbacks.onUpdateProfile(updatedData);
            //Após a atualização, volta para o modo de exibição
            profileDisplay.classList.remove('hidden');
            editProfileForm.classList.add('hidden');
            profileModal.closest(); // Fecha o modal após salvar
        });
    }
};