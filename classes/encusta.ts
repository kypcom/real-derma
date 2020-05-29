export class Encuesta
{
        public opciones = ['opcion1','opcion2','opcion3','opcion3','opcion4'];
        public valores =[0,0,0,0,0];

        constructor()
        {

        }

        getDatos()
        {
            return [
                { data: this.valores, label: 'Encuesnta' }
              ];
        }

        ingrementar(opcion:number,valor:number)
        {
            this.valores[opcion]= this.valores[opcion] + valor;

            return this.getDatos();
        }
}