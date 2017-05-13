class Pagination{
    constructor ( rt, opt, fn ) {
        this.rtSelector = rt;
        this.currentListData = [];
        this.rtElement = document.querySelector(rt);
        this.renderFn = fn;
        //this.currPage = 1;
        //this.currPagesCount= 1;
        //this.list = [];
        this.opt = Object.assign( {}, new.target.defaultOpts , opt );
        this.state = {
            list: [],
            currPage: 1,
            currPagesCount: 1
        }
    }

    setState (opt) {
        this.list = opt.list ? opt.list  
        this.list = opt.list && l;
        this.update();
    }

    get calList (){
        const list = Array.from(this.list);

        this.opt.sortFn && this.opt.sortFn.call( this, list )

        return list;
    }

    update () {
        // debugger;
        this.rtElement.innerHTML = '';
        const list = this.calList;
        const dof = document.createDocumentFragment();

        list.forEach( (val, index, arr) => {
            dof.appendChild( this.renderFn.call( this, val, index, arr ));
        })

        this.rtElement.append(dof);
    }
}

Pagination.defaultOpts = {
            interval: 5,
            limit: 5
        }

function f( val, index, arr) {
    const d = document.createElement('p');
    d.innerText = index;
    console.log(this);
    return d;
}

var p = new Pagination( '#root', {}, f);






