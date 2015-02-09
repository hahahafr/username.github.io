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


/* Fonction cosinus hyperbolique */
function cosh(val)
{
   return (Math.pow(Math.E, val) + Math.pow(Math.E, -val)) / 2;
}

/* Fonction sinus hyperbolique */
function sinh (val)
{
  return (Math.exp(val) - Math.exp(-val)) / 2;
}

/* Fonction tangente hyperbolique */
function tanh (val)
{
  return (Math.exp(val) - Math.exp(-val)) / (Math.exp(val) + Math.exp(-val));
}


function main(general)
{

    champsResultat = document.getElementById('resultats');

    // saisies
    var ordre = document.general.inputN.value;
    var attenuation = document.general.inputAmax.value;
    var freqCoup = document.general.inputFreqc.value;
    var impedance = document.general.inputRi.value;

    if ( isNaN(ordre) || isNaN(attenuation) || isNaN(freqCoup) || isNaN(impedance) || ordre <= 0 || attenuation <= 0 || freqCoup <= 0 || impedance <= 0)
    {
        champsResultat.setAttribute('class','alert alert-danger');
        champsResultat.innerHTML = "<p>Veuillez remplir correctement les champs de données</p>";
    }
    else
    {
        champsResultat.setAttribute('class','alert alert-info');

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
        Fc *= 1000; // MHz  ->  KHz
        Fc *= 1000; // KHz  ->  Hz


        /* Calcul de Wc */
        Wc = 2*Pi*Fc;

        /* Calcul de beta */
        beta = Math.log((cosh(Amax/17.37))/(sinh(Amax/17.37)));

        /* calcul de gamma */
        gamma = sinh(beta/(2*N));

        /* Calcul de R */
        if ((N%2)!=0)
        {
            R = 1;
        }
        else
        {
            R = tanh(beta/4)*tanh(beta/4);
        }

        /* Calcul de Rn */
        Rn = R*Ri;

        /* Calcul de ak */
        for(var k = 1; k<=N;k++)
        {
            ak[k] = Math.sin(((2*k-1)*Pi)/(2*N));
        }

        /* Calcul de bk */
        for(k = 1; k<=N;k++)
        {
            bk[k] = gamma*gamma + Math.sin((k)*Pi/N)*Math.sin((k)*Pi/N);
        }

        /* Calcul de gk */
        gk[1] = 2*ak[1]/gamma;
        for(k=2;k<=N;k++)
        {
            gk[k] = (4*ak[k-1]*ak[k])/(bk[k-1]*gk[k-1]);
        }

        /* Calcul de la Bobine l */
        for(k=1; k<=N ; k++)
        {
            l[k] = (Ri*gk[k])/(Wc);
        }

        /* Calcul de la Capacité C */
        for(k=1; k<=N ; k++)
        {
            c[k] = gk[k]/((Ri*Wc));
        }

        /* Affichage des résultats sous forme Exponentielle */
        var res = new Number();
        resultats = '<table class="table table-bordered">'
        resultats += '<thead> <tr>'
        resultats += '<th> Ordre # </th>   <th> C </th>   <th> L </th>   <th> R </th>'
        resultats += '</tr> </thead>'
        resultats += '<tbody>';

        for(k=1; k<=N; k++)
        {
            resultats += "<tr> <td> " + k + "</td>";

            if( (k%2) != 0 )
            {
                var aff = c[k].toPrecision(4);
                resultats += "<td>"+ aff +" F </td>";
                resultats += "<td> - </td>";
                resultats += "<td>" + Rn.toFixed(4) + " Ω </td>";
            }
            else
            {
                var aff = l[k].toPrecision(4);
                resultats += "<td> - </td>";
                resultats += "<td>" + aff + " H </td>";
                resultats += "<td>" + Rn.toFixed(4) + " Ω </td>";
            }

            resultats += "</tr>";
        }
        resultats += "</tbody> </table>";
        champsResultat.innerHTML = resultats;
    }
}
