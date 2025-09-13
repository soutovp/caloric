// src/js/ui/historyUI.js
const historySection = document.getElementById('history-section');
const historyList = document.getElementById('history-list');

export const updateHistoryUI = (calculations) => {
	historyList.innerHTML = ''; // Limpa a lista

	if (calculations.length === 0) {
		historyList.innerHTML = '<p class="text-center text-gray-500">Você ainda não tem cálculos guardados.</p>';
	} else {
		calculations.forEach((calc) => {
			const calcElement = document.createElement('div');
			calcElement.className = 'history-item bg-gray-100 p-3 rounded-lg mb-2 shadow-sm';
			calcElement.innerHTML = `
                <p><strong>Data:</strong> ${new Date(calc.createdAt).toLocaleDateString()}</p>
                <p><strong>Meta:</strong> ${calc.finalCalories.toFixed(0)} kcal</p>
                <p><strong>Macros:</strong> P:${calc.proteinGrams.toFixed(0)}g | C:${calc.carbsGrams.toFixed(0)}g | G:${calc.fatGrams.toFixed(0)}g</p>
            `;
			historyList.appendChild(calcElement);
		});
	}
};

export const showHistorySection = () => {
	if (historySection) historySection.classList.remove('hidden');
};

export const hideHistorySection = () => {
	if (historySection) historySection.classList.add('hidden');
};
