import { calculoIMC } from "./components/calculoIMC";
export let userData = {
  "peso":0,
  "altura":0
};
const form = document.querySelector("#form")
form.addEventListener("submit", function(e){
  e.preventDefault();
})
console.log(calculoIMC(1,2));
function App() {
  return (
    <div className="App">
      <form className="flex flex-col w-[25%] p-2" id="form">
        <label htmlFor="peso">Peso</label>
        <input type="number" id="peso" className="border-solid border-2 border-black m-2"/>
        <label htmlFor="altura">Altura</label>
        <input type="number" step="number" id="altura" className="border-solid border-2 border-black m-2"/>
        <button id="calcularImc" className="text-white bg-black m-2">Calcular</button>
      </form>
    </div>
  )
}

export default App
