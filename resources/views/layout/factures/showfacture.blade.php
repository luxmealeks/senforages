<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>A simple, clean, and responsive HTML invoice template</title>

    <style>
    .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px rgba(0, 0, 0, .15);
        font-size: 16px;
        line-height: 24px;
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        color: #555;
    }

    .invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
    }

    .invoice-box table td {
        padding: 5px;
        vertical-align: top;
    }

    .invoice-box table tr td:nth-child(2) {
        text-align: right;
    }

    .invoice-box table tr.top table td {
        padding-bottom: 20px;
    }

    .invoice-box table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
    }

    .invoice-box table tr.information table td {
        padding-bottom: 40px;
    }

    .invoice-box table tr.heading td {
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
    }

    .invoice-box table tr.details td {
        padding-bottom: 20px;
    }

    .invoice-box table tr.item td{
        border-bottom: 1px solid #eee;
    }

    .invoice-box table tr.item.last td {
        border-bottom: none;
    }

    .invoice-box table tr.total td:nth-child(2) {
        border-top: 2px solid #eee;
        font-weight: bold;
    }

    @media only screen and (max-width: 600px) {
        .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
        }

        .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
        }
    }

    /** RTL **/
    .rtl {
        direction: rtl;
        font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
    }

    .rtl table {
        text-align: right;
    }

    .rtl table tr td:nth-child(2) {
        text-align: left;
    }
    </style>
</head>

<body>
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="top">
                <td colspan="2">
                    <table>
                        <tr>
                            <td class="title">
                               <H5> SENFORAGE APP</H5>
                            </td>

                            <td>
                                Facture N°:   {{ $facture->id}}<br>
                                <br>
                                Créée le: {{ $facture->created_at}}<br>
                                 Date limite de paiement:  {{ $facture->date_limite}}<br>

                            </td>
                              {{-- <td>
                                Date limite de paiement:  {{ $facture->date_limite}}<br>
                                <br>
                                Date début de consommation: {{ $facture->debut_consommation}}<br>
                                Date fin de consommation: {{ $facture->fin_consommation}}<br>

                            </td> --}}
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="information">
                <td colspan="2">
                    <table>
                        <tr>

                            <td>
                               Village: {{$facture->user->client->village->nom}}<br>
                               Commune: {{$facture->user->client->village->commune->nom}}<br>
                               Departement: {{$facture->user->client->village->commune->arrondissement->departement->nom}}<br>
                               Region: {{$facture->user->client->village->commune->arrondissement->departement->region->nom}}<br>
                            </td>

                            <td>
                                Client : <br>
                               {{$facture->user->name}}<br>
                               {{$facture->user->firstname}}<br>
                               {{$facture->user->email}}<br>
                                {{$facture->user->telephone}}<br>
                            </td>


                        </tr>

                    </table>
                </td>
            </tr>

            <tr class="heading">
                <td>Méthode de paiement: <strong>{{$facture->reglement->type->name}} </strong> </td>

                <td> <br><br></td>
                <td> </td>
            </tr>

            <tr class="details">
                <td></td>
                <td></td>
                <td> 1000 </td>
            </tr>

            <tr class="heading">
                <td>ID cons</td>
                <td>Date de onsommation<br> </td>
                <td>Prix </td>
            </tr>

            <tr class="item">
            </tr>
            @foreach ($facture->consommations as $consommation)

            <tr class="item">
                <td>{{$consommation->id}} </td>
                <td> {{$consommation->date}}  <br></td>
                <td> {{$consommation->valeur}} </td>
                @endforeach
            </tr>

            <tr class="item last">
                <td>
                   TVA
                </td>

                <td>
                   18%
                </td>
            </tr>

            <tr class="total">
                <td></td>

                <td>
                   Total: {{$consommation->montant}}
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
{{-- foreach ($factures->consommation as $consommation)
    {{$facture->consommation->valeur}}
    endforeach  --}}
