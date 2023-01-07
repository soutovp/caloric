import { userFullData } from "../pages/Index";
interface imcCalcType {
    peso: number;
    altura: number;
}
export function imcCalc(){
    const imc = parseFloat((userFullData.peso / (userFullData.altura * userFullData.altura)).toFixed(2));
    console.log(imc);
    let resultado;
    switch(true){
        case imc < 18.5:
          resultado = (<p>Atualmente você está abaixo do peso normal <br/> <b className="text-[#9627A8]">Recomendamos uma dieta de ganho de peso!</b></p>);
          break;
        case imc >= 18.5 && imc < 25:
          resultado = (<p>Atualmente você está no peso normal.</p>);
          break;
        case imc >= 25.0 && imc < 30:
          resultado = (<p>Atualmente você tem excesso de peso <br/> <b className="text-[#9627A8]">Recomendamos uma dieta de perda de peso caso tenha excesso de gordura corporal.</b></p>);
          break;
        case imc >= 30.0 && imc < 35:
          resultado = (<p>Atualmente você possui obesidade grau 1 <br/> <b className="text-[#9627A8]">Recomendamos uma dieta de perda de peso.</b></p>);
          break;
        case imc >= 35.0 && imc < 40:
          resultado = (<p>Atualmente você possui obesidade grau 2 <br/> <b className="text-[#9627A8]">Recomendamos uma dieta de perda de peso.</b></p>);
          break;
        case imc > 40.0:
          resultado = (<p>Atualmente você possui obesidade grau 3 <br/> <b className="text-[#9627A8]">Recomendamos uma dieta de perda de peso.</b></p>);
          break;
        default:
          resultado = (<p>Não foi possível entender uma categoria!</p>);
          break;
      }
    return resultado;
}