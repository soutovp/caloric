import { Link, Route } from "react-router-dom";
export default function Resultado(){
     return(
          <>
               <Link to="/">Voltar</Link>

               <h1 className="flex flex-col text-3xl font-black mt-32 items-center"><b className="text-[#39A827]">CALCULADORA</b><b className="text-[#9627A8] ml-[-73px]">CALÓRICA</b></h1>
          </>
     );
}