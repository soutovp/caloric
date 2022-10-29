import { userData } from "../App";

export let calculoIMC = (peso:number, altura:number) => {
    userData.peso = peso;
    userData.altura = altura;
    const imc = peso / (altura * altura)
    return imc;
}