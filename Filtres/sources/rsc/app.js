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

    if ( isNaN(ordre) || isNaN(attenuation) || isNaN(freqCoup) || isNaN(impedance) || ordre <= 0 || attenuation <= 0 || freqCoup <= 0 || impedance <= 0 /*|| !( ordre % 2 ) */)
    {
        champsResultat.setAttribute('class','alert alert-danger');
        champsResultat.innerHTML = "<p>Veuillez remplir correctement les champs de données</p>";
    }
    else
    {
        champsResultat.setAttribute('class','alert alert-info');

        var Ak = new Array();
        var Bk = new Array();
        var c = new Array();
        var Gk = new Array();
        var l = new Array();
        var k = 0;

        /* Traduction de la fréquence de coupure en Hz */
        freqCoup *= 1000; // MHz  ->  KHz
        freqCoup *= 1000; // KHz  ->  Hz


        /* pulsation */
        Wc = 2 * Math.PI * freqCoup;

        /* beta */
        beta = Math.log( ( cosh( attenuation / 17.37 ) ) / ( sinh( attenuation / 17.37 ) ) );

        /* gamma */
        gamma = sinh( beta / ( 2 * ordre ) );

        /* calcul de R */
        if ( ( ordre % 2 ) != 0 )
        {
            R = 1;
        }
        else
        {
            R = tanh( beta / 4 ) * tanh( beta / 4 );
        }

        /* calcul de Rn */
        Rn = R * impedance;

        /* calcul des Ak */
        for( k = 1; k <= ordre; k++ )
        {
            Ak[k] = Math.sin( ( ( 2 * k-1 ) * Math.PI ) / ( 2 * ordre ) );
        }

        /* calcul des Bk */
        for( k = 1; k <= ordre; k++ )
        {
            Bk[k] = gamma * gamma + Math.sin( k * Math.PI / ordre ) * Math.sin( k * Math.PI / ordre );
        }

        /* calcul des Gk */
        Gk[1] = 2 * Ak[1] / gamma;

        for( k = 2; k <= ordre ; k++ )
        {
            Gk[k] = ( 4 * Ak[k-1] * Ak[k] ) / ( Bk[k-1] * Gk[k-1] );
        }

        /* calcul des L */
        for( k = 1; k <= ordre ; k++ )
        {
            l[k] = ( impedance * Gk[k] ) / Wc ;
        }

        /* calcul des C */
        for( k = 1; k <= ordre ; k++ )
        {
            c[k] = Gk[k] / ( ( impedance * Wc ) );
        }


        /* Affichage des résultats sous forme Exponentielle */
        resultats = '<table class="table table-bordered">'
        resultats += '<thead> <tr>'
        resultats += '<th> Ordre # </th>   <th> C </th>   <th> L </th>   <th> R </th>'
        resultats += '</tr> </thead>'
        resultats += '<tbody>';

        for(k=1; k<= ordre; k++)
        {
            resultats += "<tr> <td> " + k + "</td>";

            if( (k%2) != 0 )
            {
                var aff = c[k].toPrecision(5);
                resultats += "<td>"+ aff +"  F </td>";
                resultats += "<td> - </td>";
                resultats += "<td>" + Rn + "  Ω </td>";
            }
            else
            {
                var aff = l[k].toPrecision(5);
                resultats += "<td> - </td>";
                resultats += "<td>" + aff + "  H </td>";
                resultats += "<td>" + Rn + "  Ω </td>";
            }

            resultats += "</tr>";
        }
        resultats += "</tbody> </table>";
        champsResultat.innerHTML = resultats;
    }
}
