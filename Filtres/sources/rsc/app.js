/*
   app.js

   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
   MA 02110-1301, USA.
*/


/* Fonction cosh */
function cosh(aValue)
{
   return (Math.pow(Math.E, aValue) + Math.pow(Math.E, -aValue)) / 2;
}

/* Fonction sinh */
function sinh (arg)
{
  return (Math.exp(arg) - Math.exp(-arg)) / 2;
}

/* Fonction tanh */
function tanh (arg)
{
  return (Math.exp(arg) - Math.exp(-arg)) / (Math.exp(arg) + Math.exp(-arg));
}


function main(general)
{

/* Script de calcul du filtre de Tchebyscheff */
var ordre = document.general.inputN.value;
var attenuation = document.general.inputAmax.value;
var freqCoup = document.general.inputFreqc.value;
var impedance = document.general.inputRi.value;

    if (isNaN(ordre) || ordre>0)
    {
        var att=document.createAttribute("class");
        att.value="alert-success";
        document.getElementById('result').setAttributeNode(att);
        var resultlabel = document.createTextNode("Resultats :");
        document.getElementById('result').appendChild(resultlabel);
        var newLink = document.createElement('br');
        document.getElementById('result').appendChild(newLink);

        var N = new Number(ordre); /* Ordre du filtre */
        var ak = new Array();
        var Amax = new Number(attenuation);/* Taux d'ondulation dans la bande */
        var beta = new Number();
        var bk = new Array();
        var c = new Array();
        var Fc = new Number(freqCoup); /* Fréquence de coupure FC */
        var gamma = new Number();
        var gk = new Array();
        var l = new Array();
        var Wc = new Number(); /* Pulsation de coupure */
        var R = new Number();
        var Ri = new Number(impedance);
        var Rn = new Number();
        var Pi = new Number(Math.PI);



        /* Traduction de la fréquence de coupure en Hz */
        Fc = Fc * 1000000;


        /* Calcul de Wc */
        Wc = 2*Pi*Fc;

        /* Calcul de beta */
        beta = Math.log((cosh(Amax/17.37))/(sinh(Amax/17.37)));

        /* calcul de gamma */
        gamma = sinh(beta/(2*N));

        /* Calcul de R */
        if ((N%2)!=0){
            R = 1;
        }else{
            R = tanh(beta/4)*tanh(beta/4);
        }

        /* Calcul de Rn */
        Rn = R*Ri;

        /* Calcul de ak */
        for(var k = 1; k<=N;k++){
            ak[k] = Math.sin(((2*k-1)*Pi)/(2*N));
        }

        /* Calcul de bk */
        for(k = 1; k<=N;k++){
            bk[k] = gamma*gamma + Math.sin((k)*Pi/N)*Math.sin((k)*Pi/N);
        }

        /* Calcul de gk */
        gk[1] = 2*ak[1]/gamma;
        for(k=2;k<=N;k++){
            gk[k] = (4*ak[k-1]*ak[k])/(bk[k-1]*gk[k-1]);
        }

        /* Calcul de la Bobine l */
        for(k=1; k<=N ; k++){
            l[k] = (Ri*gk[k])/(Wc);
        }

        /* Calcul de la Capacité C */
        for(k=1; k<=N ; k++){
            c[k] = gk[k]/((Ri*Wc));
        }
        var expr1="C[";
        var expr2="] = ";
        var expr3=" F et Rn = ";
        var expr5="L[";
        var expr6=" H et Rn = ";
        /* Affichage des résultats sous forme Exponentielle */
        var res = new Number();
        for(k=1; k<=N;k++){
            if((k%2)!=0){
                res = c[k];
                var tchebir=expr1+k+expr2+res.toExponential()+expr3+Rn;
                var newLinkText = document.createTextNode(tchebir);
                document.getElementById('result').appendChild(newLinkText);
                var newLink = document.createElement('br');
                document.getElementById('result').appendChild(newLink);
            }else{
                res = l[k];
                var tchebir=expr5+k+expr2+res.toExponential()+expr6+Rn;
                var newLinkText = document.createTextNode(tchebir);
                document.getElementById('result').appendChild(newLinkText);
                        var newLink = document.createElement('br');
                document.getElementById('result').appendChild(newLink);
            }
        }
    }
    else{
            var att=document.createAttribute("class");
            att.value="alert-danger";
            document.getElementById('result').setAttribute(att);
            var resultlabel = document.createTextNode("Attention il y a des erreurs dans le formulaire");
            document.getElementById('result').appendChild(resultlabel);
    }
}
