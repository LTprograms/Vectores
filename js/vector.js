class Vector{
    constructor(){
        this._name = "";
        this._module = new Decimal(0);
        //components
        this._componentx = new Decimal(0);
        this._componenty = new Decimal(0);
        //direction
        this._direction = new Decimal(0);
    }
    //GETTERS
    get name(){
        return this._name;
    }
    get module(){
        return this._module;
    }
    get components(){
        return [this._componentx, this._componenty];
    }
    get direction(){
        return this._direction;
    }
    //SETTERS
    set name(n){
        this._name = n;
    }
    set module(mod){
        this._module = new Decimal(mod);
    }
    //---components
    set componentx(x){
        this._componentx = new Decimal(x);
    }
    set componenty(y){
        this._componenty = new Decimal(y);
    }
    //---directions
    set direction(d){
        this._direction = new Decimal(d);
    }
    //CALCULATE FUNCTIONS
    moduleCalc(){
        let x = this._componentx;
        let y = this._componenty;
        let m = (x.toPower(2).plus(y.toPower(2))).squareRoot();
        this._module = m.toDecimalPlaces(2);
    }
    directionCalc(){
        let x = this._componentx;
        let y = this._componenty;
        let d;
        try {
            d = new Decimal(Math.atan(y/x));
        } catch (error) {
            d = new Decimal(0);
        }              
        this._direction = d.times(180).dividedBy(Math.PI).toDecimalPlaces(2);
    }
    componentsCalc(){
        let m = this._module;
        let d = this._direction;
        let x = m.times(Math.cos(d.times(Math.PI).dividedBy(180)));
        let y = m.times(Math.sin(d.times(Math.PI).dividedBy(180)));
        this._componentx = x.toDecimalPlaces(2);
        this._componenty = y.toDecimalPlaces(2);
    }
    unitVector(v){
        let c = v.components;
        let x = c[0];
        let y = c[1];
        this._direction = v.direction;
        this._module = new Decimal(1);
        this._componentx = x.dividedBy(v.module).toDecimalPlaces(2);
        this._componenty = y.dividedBy(v.module).toDecimalPlaces(2);
    }
    escalarVector(v, esc){        
        this._direction = v.direction;
        let mod = v.module;
        this._module = mod.times(esc)
        this.componentsCalc();
    }
    addition(v, b){
        let c = v.components;
        let x = c[0];
        let y = c[1];
        if (b) {            
            this._componentx = this._componentx.plus(x);
            this._componenty = this._componenty.plus(y);
        }else{
            this._componentx = this._componentx.minus(x);
            this._componenty = this._componenty.minus(y);
        }
        this.moduleCalc();
        this.directionCalc();
    }
    static escalarProduct(v1, v2){
        let c1 = v1.components;
        let c2 = v2.components;
        return c1[0].times(c2[0]).plus(c1[1].times(c2[1]));
    }
    static vectorialProduct(v1, v2){
        let c1 = v1.components;
        let c2 = v2.components;
        let zero = new Decimal(0);
        let matrix = [
            [c1[0], c1[1], zero],
            [c2[0], c2[1], zero],
        ]
        let comp = new Array(4);
        comp[0] = matrix[0][1].times(matrix[1][2]).minus(matrix[0][2].times(matrix[1][1]));
        comp[1] = matrix[0][0].times(matrix[1][2]).minus(matrix[0][2].times(matrix[1][0])).times(-1);
        comp[2] = matrix[0][0].times(matrix[1][1]).minus(matrix[0][1].times(matrix[1][0]));
        comp[3] = comp[0].toPower(2).plus(comp[1].toPower(2)).plus(comp[2].toPower(2)).squareRoot();
        return comp;
    }
    //CANON VECTORS
    static canonVectors(){
        //---i
        let i = new Vector();
        i.name = "i";
        i.componentx = new Decimal(1);
        i.module = new Decimal(1);
        //---j
        let j = new Vector();
        j.name = "j";
        j.componenty = new Decimal(1);
        j.module = new Decimal(1);
        j.direction = new Decimal(90);
        //return
        return [i,j];
    }
}