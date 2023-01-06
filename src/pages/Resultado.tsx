import { Link, Route } from "react-router-dom";
import { imcCalc } from "../components/imcCalc";
import { userFullData } from "./Index";

export default function Resultado(){
     console.log("This is :"+userFullData.altura);
     // console.log(userFullData);
     return(
          <>
               <Link to="/">Voltar</Link>

               <h1 className="flex flex-col text-3xl font-black mt-32 items-center"><b className="text-[#39A827]">CALCULADORA</b><b className="text-[#9627A8] ml-[-73px]">CALÓRICA</b></h1>

               <form className="flex flex-col w-[100%] xl:w-[50%] sm:w-[65%] p-2 content-center mt-[68px] m-auto font-[inter]">
                    <h2 className="text-center text-[#9627A8] text-[20px]">Seu Objetivo é: <b className="text-[#39A827]">{userFullData.objective}</b></h2>

                    <div className="text-center">{imcCalc()}</div>

                    <h3 className="text-[#9627A8] text-[25px] font-[1000] mt-[36px] text-center">Seu gasto calórico é de:</h3>
                    <div className="mt-[5px] p-[10px] bg-white text-center text-[32px] rounded-[5px] shadow-md">
                         <p className="text-[#39A827] font-[1000]">{userFullData.gastoCalorico}</p>
                    </div>
               </form>
          </>
     );
}