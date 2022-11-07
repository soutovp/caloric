import { userFullData } from "../App";

export interface importantDataInterface{
    gToCalProteina:number;
    gToCalCarboidrato:number;
    gToCalGordura:number;
  }
  export const importantData:importantDataInterface = {
    gToCalProteina:4,
    gToCalCarboidrato:4,
    gToCalGordura:9,
  }
  export function macronutrientsCalc(){
    console.log(userFullData.gastoCalorico);
    if(userFullData.objective === "ganho"){
        userFullData.gastoCalorico *= 1.2
        const proteina = 0.4;
        const carboidrato = 0.4;
        const gordura = 0.2;
        const resultado = [parseFloat((proteina*userFullData.gastoCalorico).toFixed(2)), parseFloat((carboidrato*userFullData.gastoCalorico).toFixed(2)), parseFloat((gordura*userFullData.gastoCalorico).toFixed(2))]
        userFullData.gProteina = parseFloat((resultado[0] / importantData.gToCalProteina).toFixed(2));
        userFullData.gCarboidrato = parseFloat((resultado[1] / importantData.gToCalCarboidrato).toFixed(2));
        userFullData.gGordura = parseFloat((resultado[2] / importantData.gToCalGordura).toFixed(2));
        console.log(resultado);
    }
    if(userFullData.objective === "perda"){
        userFullData.gastoCalorico *= 0.8
        const proteina = 0.4;
        const carboidrato = 0.4;
        const gordura = 0.2;
        const resultado = [parseFloat((proteina*userFullData.gastoCalorico).toFixed(2)), parseFloat((carboidrato*userFullData.gastoCalorico).toFixed(2)), parseFloat((gordura*userFullData.gastoCalorico).toFixed(2))]
        userFullData.gProteina = parseFloat((resultado[0] / importantData.gToCalProteina).toFixed(2));
        userFullData.gCarboidrato = parseFloat((resultado[1] / importantData.gToCalCarboidrato).toFixed(2));
        userFullData.gGordura = parseFloat((resultado[2] / importantData.gToCalGordura).toFixed(2));
        console.log(resultado);
    }
    if(userFullData.objective === "manter"){
        userFullData.gastoCalorico *= 1.0
        const proteina = 0.4;
        const carboidrato = 0.4;
        const gordura = 0.2;
        const resultado = [parseFloat((proteina*userFullData.gastoCalorico).toFixed(2)), parseFloat((carboidrato*userFullData.gastoCalorico).toFixed(2)), parseFloat((gordura*userFullData.gastoCalorico).toFixed(2))]
        userFullData.gProteina = parseFloat((resultado[0] / importantData.gToCalProteina).toFixed(2));
        userFullData.gCarboidrato = parseFloat((resultado[1] / importantData.gToCalCarboidrato).toFixed(2));
        userFullData.gGordura = parseFloat((resultado[2] / importantData.gToCalGordura).toFixed(2));
        console.log(resultado);
    }
  }