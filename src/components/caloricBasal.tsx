import { userFullData } from "../App";
interface categoriaInterface{
    feminino:{
        primeiro:{
            equacaoUm:number;
            equacaoDois:number;
        };
        segundo:{
            equacaoUm:number;
            equacaoDois:number;
        };
        terceiro:{
            equacaoUm:number;
            equacaoDois:number;
        };
    };
    masculino:{
        primeiro:{
            equacaoUm:number;
            equacaoDois:number;
        };
        segundo:{
            equacaoUm:number;
            equacaoDois:number;
        };
        terceiro:{
            equacaoUm:number;
            equacaoDois:number;
        };
    };
    resultado:{
        gastoCalorico:number;
    }
}
const categoria:categoriaInterface = {
    feminino:{
        primeiro:{
            equacaoUm:14.818,
            equacaoDois:486.6,
        },
        segundo:{
            equacaoUm:8.126,
            equacaoDois:845.6,
        },
        terceiro:{
            equacaoUm:9.082,
            equacaoDois:658.5,
        },
    },
    masculino:{
        primeiro:{
            equacaoUm:15.057,
            equacaoDois:692.2,
        },
        segundo:{
            equacaoUm:11.472,
            equacaoDois:873.1,
        },
        terceiro:{
            equacaoUm:11.711,
            equacaoDois:587.7,
        },
    },
    resultado:{
        gastoCalorico:0,
    }
}
export function caloricBasal(){
    let resultado = 0;
    const idade = userFullData.idade;
    if(userFullData.genero === 'feminino'){
        switch(true){
            case idade >= 18 && idade < 31:
                resultado = (( categoria.feminino.primeiro.equacaoUm * userFullData.peso) + categoria.feminino.primeiro.equacaoDois) * userFullData.atividadeValue;
                break;
            case idade > 30 && idade <= 60:
                resultado = (( categoria.feminino.segundo.equacaoUm * userFullData.peso) + categoria.feminino.segundo.equacaoDois) * userFullData.atividadeValue;
                break;
            case idade > 60:
                resultado = (( categoria.feminino.terceiro.equacaoUm * userFullData.peso) + categoria.feminino.terceiro.equacaoDois) * userFullData.atividadeValue;
                break;
            default:
                console.log('Feminino não identificou variáveis.');
                break;
        }
    }
    if(userFullData.genero === 'masculino'){
        switch(true){
            case idade >= 18 && idade < 31:
                resultado = (( categoria.masculino.primeiro.equacaoUm * userFullData.peso) + categoria.masculino.primeiro.equacaoDois) * userFullData.atividadeValue;
                break;
            case idade > 30 && idade <= 60:
                resultado = (( categoria.masculino.segundo.equacaoUm * userFullData.peso) + categoria.masculino.segundo.equacaoDois) * userFullData.atividadeValue;
                break;
            case idade > 60:
                resultado = (( categoria.masculino.terceiro.equacaoUm * userFullData.peso) + categoria.masculino.terceiro.equacaoDois) * userFullData.atividadeValue;
                break;
            default:
                console.log('Masculino não identificou variáveis.');
                break;
        }
    }
    userFullData.gastoCalorico = parseFloat(resultado.toFixed(1));
}