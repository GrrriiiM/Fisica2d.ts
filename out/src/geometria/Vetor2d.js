export class Vetor2d {
    constructor(_x = 0, _y = 0) {
        this._x = _x;
        this._y = _y;
    }
    get x() { return this._x; }
    get y() { return this._y; }
    set(arg1, arg2) {
        if (arg1 instanceof Vetor2d) {
            this._x = arg1._x;
            this._y = arg1._y;
        }
        else {
            this._x = arg1;
            this._y = arg2;
        }
        return this;
    }
    get copia() { return new Vetor2d(this._x, this._y); }
    get magQ() { return Math.pow(this._x, 2) + Math.pow(this._y, 2); }
    get mag() { return Math.sqrt(this.magQ); }
    normV() {
        let m = this.mag;
        if (m == 0)
            return this;
        this._x /= m;
        this._y /= m;
        return this;
    }
    norm() { return this.copia.normV(); }
    perpV() {
        let x = this._x;
        this._x = -this._y;
        this._y = x;
        return this;
    }
    perp() { return this.copia.perpV(); }
    invV() {
        this._x = -this._x;
        this._y = -this._y;
        return this;
    }
    inv() { return this.copia.invV(); }
    adicV(v) {
        this._x += v.x;
        this._y += v.y;
        return this;
    }
    adic(v) { return this.copia.adicV(v); }
    subV(v) {
        this._x -= v.x;
        this._y -= v.y;
        return this;
    }
    sub(v) { return this.copia.subV(v); }
    divV(n) {
        this._x /= n;
        this._y /= n;
        return this;
    }
    div(n) { return this.copia.divV(n); }
    multV(n) {
        this._x *= n;
        this._y *= n;
        return this;
    }
    mult(n) { return this.copia.multV(n); }
    rotV(rad) {
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const x = this._x;
        const y = this._y;
        this._x = x * cos - y * sin;
        this._y = x * sin + y * cos;
        return this;
    }
    rot(n) { return this.copia.rotV(n); }
    dot(vetor) {
        return this.x * vetor.x + this.y * vetor.y;
    }
    cross(vetor) {
        return (this.x * vetor.y) - (this.y * vetor.x);
    }
    static cross3(vetorA, vetorB, vetorC) {
        return (vetorB.x - vetorA.x) * (vetorC.y - vetorA.y) - (vetorB.y - vetorA.y) * (vetorC.x - vetorA.x);
    }
}
//# sourceMappingURL=Vetor2d.js.map