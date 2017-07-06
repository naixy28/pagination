class Pagination{
    constructor ( opt ) {
        if ( !new.target) throw 'Pagination() must be called with new!';

        // merge options
        this.opt = Object.assign( {}, new.target.defaultOpts , opt );
        this.renderFn = this.opt.renderFn;

        // get containers
        this.rtElement = document.querySelector(this.opt.el);
        this.btnGpElement = document.querySelector(this.opt.btnGpEl);
        if ( !this.rtElement ) throw 'Must set a root element to place list!';

        // init state
        this.currPageCount = 0;
        this.state = {
            list: [],
            currPage: 0,
        }

        this.sc = false;

        // init button group
        this.btnGpElement && this.initBtnGroup();
    }

    initBtnGroup() {
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = this.opt.prevBtnHtml;
        prevBtn.classList.add( 'pg-prev-btn', 'pg-btn' );
        prevBtn.addEventListener('click', (e) => {
            this.prev();
        })

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = this.opt.nextBtnHtml;
        nextBtn.classList.add( 'pg-next-btn', 'pg-btn' );
        nextBtn.addEventListener('click', (e) => {
            this.next();
        })

        const btnGpContainer = document.createElement('p');
        btnGpContainer.classList.add('pg-btn-gp');

        btnGpContainer.appendChild(prevBtn);
        btnGpContainer.appendChild(nextBtn);

        const stateSpan = document.createElement('span');
        stateSpan.classList.add('pg-state');

        btnGpContainer.insertBefore( stateSpan, nextBtn );

        this.btnGpElement.appendChild(btnGpContainer);
    }

    next(){
        if ( this.state.currPage < this.currPageCount - 1 ) {
            this.setState( {currPage: ++this.state.currPage } )
        }
    }

    prev(){
        if ( this.state.currPage > 0 ) {
            this.setState( {currPage: --this.state.currPage } )
        }
    }

    setState (opt) {
        this.state = Object.assign({}, this.state, opt);
        if( !this.state.list ) {
            this.state.list = [];
        }
        this.update();
    }

    calPageRange() {
        const len = this.state.list.length,
            interval = this.opt.interval,
            limit = this.opt.limit;
        let start = 0,
            end = interval - 1;
        this.currPageCount = ~~(len / interval) + (len % interval > 0 ? 1 : 0);

        if ( this.state.currPage < 0 || this.currPageCount === 0 ) {
            this.state.currPage = 0;
        } else if ( this.state.currPage >= this.currPageCount  ) {
            this.state.currPage = this.currPageCount - 1;
        }
        start = interval * this.state.currPage;
        end = start + interval - 1;
        return { start: start, end: end };
    }

    get calList (){
        let currList = Array.from(this.state.list || []);

        if( this.sc ) { console.log(this.state.list) };


        // sort 
        this.opt.sortFn && Array.prototype.sort.call(currList, this.opt.sortFn );

        // get index range
        const range = this.calPageRange();
        // console.log(this.currPageCount, this.state.currPage, range);

        currList = currList.filter( (val, index, arr) => {
            if( index <= range.end && index >= range.start ) {
                return true;
            }
        })

        return currList;
    }

    update () {
        this.rtElement.innerHTML = '';

        // run getter of calList
        const list = this.calList;

        // render list
        const dof = document.createDocumentFragment();
        list.forEach( (val, index, arr) => {
            dof.appendChild( this.renderFn.call( this, val, index, arr ));
        })
        this.rtElement.append(dof);

        // update button group text
        if ( this.btnGpElement ){
            if ( this.state.list.length === 0 ) {
                // when count = 0, manual fix display
                this.btnGpElement.querySelector('.pg-state').innerHTML = this.i18n('pageInfoEmpty');
            } else {
                this.btnGpElement.querySelector('.pg-state').innerHTML = this.i18n('pageInfo').replace( /_CURR_/g, this.state.currPage + 1 ).replace(/_LEN_/g, this.currPageCount);
            }

            if(this.state.currPage === 0) {
                this.btnGpElement.querySelector('.pg-prev-btn').classList.add('disabled');
            } else {
                this.btnGpElement.querySelector('.pg-prev-btn').classList.remove('disabled');
            }
            if(this.state.currPage === this.currPageCount - 1) {
                this.btnGpElement.querySelector('.pg-next-btn').classList.add('disabled');
            } else {
                this.btnGpElement.querySelector('.pg-next-btn').classList.remove('disabled');
            }
        }
    }

    subscribe () {
        this.sc = !this.sc;
    }

    i18n (key) {
        let currLan = this.opt.language in this.opt.languageMapping ? this.opt.language : 'en';
        return this.opt.languageMapping[currLan] && this.opt.languageMapping[currLan][key];
    }
}

Pagination.defaultOpts = {
            el: '#pg-root',
            renderFn: null,
            sortFn: null,
            btnGpEl: '#pg-ctrl',
            interval: 5,
            limit: 5,
            prevBtnHtml: '<',
            nextBtnHtml: '>',
            languageMapping: {
                en: {
                    pageInfoEmpty: 'Page 0 of 1',
                    pageInfo: 'Page _CURR_ of _LEN_'
                },
                zh: {
                    pageInfoEmpty: '第0页，共1页',
                    pageInfo: '第_CURR_页，共_LEN_页'
                }
            },
            language: 'en'
        }
