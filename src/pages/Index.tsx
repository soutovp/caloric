import { Link, Route, unstable_HistoryRouter, useNavigate } from "react-router-dom";
import { caloricBasal } from "../components/caloricBasal";
import { imcCalc } from "../components/imcCalc";
import { macronutrientsCalc } from "../components/macronutrientsCalc";
import Resultado from "./Resultado";
export interface userFullDataInterface{
     peso:number;
     altura:number;
     idade:number;
     genero:string;
     objective:string;
     gastoCalorico:number;
     gProteina:number;
     gCarboidrato:number;
     gGordura:number;
     atividadeValue:number
   }
   export let userFullData:userFullDataInterface = {
     peso:0,
     altura:0,
     idade:0,
     genero:'',
     objective:'',
     gastoCalorico:0,
     gProteina:0,
     gCarboidrato:0,
     gGordura:0,
     atividadeValue:0,
   }
// import { resultadoUserFullData } from "./Resultado";

export default function Index(){
     function handleSubmit(){
          
          // e.preventDefault();
          const peso = document.querySelector("#peso") as HTMLInputElement;
          const altura = document.querySelector("#altura") as HTMLInputElement;
          const objective = document.querySelector("#objetivo") as HTMLSelectElement;
          const genFeminino = document.querySelector("#genFeminino") as HTMLInputElement;
          const genMasculino = document.querySelector("#genMasculino") as HTMLInputElement;
          const output = document.querySelector("#resultadoIMC") as HTMLDivElement;
          const idade = document.querySelector('#idade') as HTMLInputElement;
          const atividade = document.querySelector('#atividade') as HTMLSelectElement;
          userFullData.peso = parseFloat(peso.value);
          userFullData.altura = parseFloat(altura.value.replace(",","."));
          userFullData.genero = genFeminino.checked ? genFeminino.value : genMasculino.value;
          userFullData.objective = objective.value;
          userFullData.idade = parseFloat(idade.value);
          userFullData.atividadeValue = parseFloat(atividade.value);
          caloricBasal();
          macronutrientsCalc();
          // showHideForm();
          
          output.innerHTML = `${imcCalc()}<br/>`;
          output.innerHTML+= `Seu objetivo é : ${userFullData.objective} <br/><br/>`
          output.innerHTML+= `Seu gasto calórico é de : ${(userFullData.gastoCalorico).toFixed(2)}Kcal<br/><br/>`
          output.innerHTML+= `Você deverá consumir para seu objetivo :<br/>Proteína : ${userFullData.gProteina}g<br/>Carboidrato: ${userFullData.gCarboidrato}g<br/>Gordura: ${userFullData.gGordura}g`
          output.innerHTML+= `<input type="button" value="voltar" onClick="showHideForm()/>"`

          console.log(userFullData);
     }
     return(
          <div className="App">
               <h1 className="flex flex-col text-3xl font-black mt-32 items-center"><b className="text-[#39A827]">CALCULADORA</b><b className="text-[#9627A8] ml-[-73px]">CALÓRICA</b></h1>
               {/* @ts-ignore */}
               <form className="flex flex-col w-[100%] xl:w-[50%] sm:w-[65%] p-2 content-center mt-[68px] m-auto font-[inter]" id="form" onSubmit={(e)=>handleSubmit(e)}>
               <label htmlFor="peso" className="text-[20px]">Peso</label>
               <input id="peso" step="any" className="border-solid border-1 border-[#FCFCFC] h-[50px] p-2 m-2 rounded-[5px] focus:outline-none text-[#9627A8] font-bold text-[20px] focus:border-[#9627A8] focus:ring-[#9627A8] focus:ring-2"/>
               <label htmlFor="altura" className="text-[20px]">Altura</label>
               <input id="altura" className="border-solid border-1 border-[#FCFCFC] h-[50px] p-2 m-2 rounded-[5px] focus:outline-none text-[#9627A8] font-bold text-[20px] focus:border-[#9627A8] focus:ring-[#9627A8] focus:ring-2"/>
               <label htmlFor="objetivo" className="text-[20px]">Objetivo</label>
               <select id="objetivo" className="border-solid border-1 border-[#FCFCFC] h-[50px] p-2 m-2 rounded-[5px] focus:outline-none text-[#9627A8] font-bold text-[20px] focus:border-[#9627A8] focus:ring-[#9627A8] focus:ring-2">
                    <option value="Ganho">Ganho de Massa</option>
                    <option value="Perda">Perda de Peso</option>
                    <option value="Manter">Manter o Peso</option>
               </select>
               <p className="text-[20px] after:content-['?'] after:[5px] after:text-[#9627A8]">Atividade</p>
               {/* <p><b>Leve :</b> Atividades de casa, Trabalhar sentado, caminhar 1hr</p>
               <p><b>Moderada :</b> Incluí alguma atividade esportiva por até 1hr, Trabalhar em pé, fazer atividades de casa...</p>
               <p><b>Intensa :</b> Atividades de casa, Trabalhos mais ativos, caminhar mais de 1hr por dia, atividades esportivas...</p> */}
               <select id="atividade" className="border-solid border-1 border-[#FCFCFC] h-[50px] p-2 m-2 rounded-[5px] focus:outline-none text-[#9627A8] font-bold text-[20px] focus:border-[#9627A8] focus:ring-[#9627A8] focus:ring-2">
                    <option value={1.55}>Leve</option>
                    <option value={1.84}>Moderada</option>
                    <option value={2.2}>Intensa</option>
               </select>
               <label htmlFor="idade" className="text-[20px]">Qual a sua Idade?</label>
               <input type="number" placeholder="" name="idade" id="idade" className="border-solid border-1 border-[#FCFCFC] h-[50px] p-2 m-2 rounded-[5px] focus:outline-none text-[#9627A8] font-bold text-[20px] w-[20%] text-center focus:border-[#9627A8] focus:ring-[#9627A8] focus:ring-2"/>
               <div className="m-2 flex flex-row">
                    <input className="m-2 focus:outline-none focus:outline-2 focus:outline-[#9627A8] accent-[#9627A8]" type="radio" id="genMasculino" name="gen" value={'masculino'}/>
                    <label htmlFor="genMasculino">Masculino</label>
               </div>
               <div className="m-2 flex flex-row">
                    <input className="m-2 focus:outline-none focus:outline-2 focus:outline-[#9627A8] accent-[#9627A8]" type="radio" id="genFeminino" name="gen" value={'feminino'}/>
                    <label htmlFor="genMasculino">Feminino</label>
               </div>
               <Link id="calcularImc" to={{
                    pathname:"/resultado",
                    
               }} className="" onClick={handleSubmit}>
                    <button className="w-[100%] h-[50px] p-2 rounded-[5px] focus:outline-none focus:outline-2 focus:outline-[#9627A8] text-white font-bold text-[20px] bg-[#39A827]">Calcular</button>
               </Link>
               </form>
               <hr />
               <div id="resultadoIMC" className="m-2"></div>
          </div>
     )
}