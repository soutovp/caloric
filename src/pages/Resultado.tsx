import { Link, Route } from "react-router-dom";
import { imcCalc } from "../components/imcCalc";
import { userFullData } from "./Index";

export default function Resultado(){
     return(
          <>

               <h1 className="flex flex-col text-3xl font-black mt-32 items-center"><b className="text-[#39A827]">CALCULADORA</b><b className="text-[#9627A8] ml-[-73px]">CALÓRICA</b></h1>

               <form className="flex flex-col w-[90%] xl:w-[25%] sm:w-[65%] p-2 content-center mt-[68px] m-auto font-[inter]">
                    <h2 className="text-center text-[#9627A8] text-[20px]">Seu Objetivo é: <b className="text-[#39A827]">{userFullData.objective}</b></h2>

                    <div className="text-center">{imcCalc()}</div>

                    <h3 className="text-[#9627A8] text-[25px] font-[1000] mt-[36px] text-center">Você precisa consumir:</h3>
                    <div className="mt-[5px] p-[10px] bg-white text-center text-[32px] rounded-[5px] shadow-md">
                         <p className="text-[#39A827] font-[1000]">{userFullData.gastoCalorico.toFixed(2)}cal</p>
                    </div>

                    <div className="m-auto">
                         <h3 className="text-[#9627A8] text-[25px] font-[1000] mt-[36px] text-center">Para alcançar sua meta</h3>
                         <p className="text-[#9627A8]">Deverá consumir:</p>
                    </div>
                    <h3 className="text-[#9627A8] text-[25px] font-[1000] mt-[10px]">Proteinas -</h3>
                    <div className="mt-[5px] p-[10px] bg-white text-center text-[32px] rounded-[5px] shadow-md">
                         <p className="text-[#39A827] font-[1000]">{userFullData.gProteina}g</p>
                    </div>
                    <h3 className="text-[#9627A8] text-[25px] font-[1000] mt-[36px]">Carboidratos -</h3>
                    <div className="mt-[5px] p-[10px] bg-white text-center text-[32px] rounded-[5px] shadow-md">
                         <p className="text-[#39A827] font-[1000]">{userFullData.gCarboidrato}g</p>
                    </div>
                    <h3 className="text-[#9627A8] text-[25px] font-[1000] mt-[36px]">Gorduras -</h3>
                    <div className="mt-[5px] p-[10px] bg-white text-center text-[32px] rounded-[5px] shadow-md">
                         <p className="text-[#39A827] font-[1000]">{userFullData.gGordura}g</p>
                    </div>
                    <Link to="/" className="mt-[64px] mb-[64px] text-center w-[100%] h-[50px] p-2 rounded-[5px] focus:outline-none focus:outline-2 focus:outline-[#9627A8] text-white font-bold text-[20px] bg-[#39A827]">Voltar</Link>
               </form>
          </>
     );
}