interface imcCalcType {
    peso: number;
    altura: number;
}
import { userFullData } from "../App";
export function imcCalc(){
    const imc = userFullData.peso / (userFullData.altura * userFullData.altura);
    console.log(imc)
    let resultado;
    switch(true){
        case imc < 18.5:
          resultado = 'Abaixo do peso normal <br/> Recomendamos uma dieta de ganho de peso!';
          break;
        case imc >= 18.5 && imc < 25:
          resultado = 'Você está no peso normal.';
          break;
        case imc >= 25.0 && imc < 30:
          resultado = 'Excesso de peso <br/> Recomendamos uma dieta de perda de peso caso tenha excesso de gordura corporal.';
          break;
        case imc >= 30.0 && imc < 35:
          resultado = 'Obesidade grau 1 <br/> Recomendamos uma dieta de perda de peso.';
          break;
        case imc >= 35.0 && imc < 40:
          resultado = 'Obesidade grau 2 <br/> Recomendamos uma dieta de perda de peso.';
          break;
        case imc > 40.0:
          resultado = 'Obesidade grau 3 <br/> Recomendamos uma dieta de perda de peso.';
          break;
        default:
          resultado = 'Não foi possível entender uma categoria!';
          break;
      }
    return resultado;
}