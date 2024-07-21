const { stopwords } = require('stopword');
const { closest } = require('fastest-levenshtein');
const { parentPort } = require('worker_threads');



// source: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html
class Engine {
    constructor() {
        this.data = {};
        this.count_dict = {};
        this.tfid_dict = {}; 
        this.vectorize_dict = [];
        this.total_num = 0;

        this.cluster_data = [];
        this.cluster_count = {};
        this.cluster_tfid_dict = {};
        this.cluster_vectorize_dict = [];
        this.cluster_max_iterations = 100;
        this.cluster_total_num = 0;


    }

    tokenizer(term) {
        const stopWords = new Set(stopwords); 
        const tokens = term.toLowerCase().split(/\W+/).filter(word => word.length > 0 && !stopWords.has(word));
        return tokens;
    }
    spellcheck(term) {
        let words = Object.keys(this.count_dict);
        return closest(term,words);
    }

    start(data) {
        this.data = data;
        this.preprocess_count();
        this.tfid_fit_transform();
        //this.cluster_preprocess_count();
        //this.cluster_tfid_fit_transform();
    }
    // https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html#sklearn.feature_extraction.text.CountVectorizer
    preprocess_count() { 
        this.data.forEach((item) => {
            let words = item.name_processed.trim().split(" ");
            words.forEach((word) => {
                if (this.count_dict.hasOwnProperty(word)) {
                    this.count_dict[word]+=1;
                } else {
                    this.count_dict[word] = 1;
                }
                this.total_num += 1;
            });
        });
    }

    // https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfTransformer.html#sklearn.feature_extraction.text.TfidfTransformer
    tfid_fit_transform() {
        Object.keys(this.count_dict).forEach((word) => {
            this.tfid_dict[word] = Math.log((this.total_num+1)/(this.count_dict[word]+1)) + 1;
        });
        this.tfid_vectorize();

    }
    tfid_vectorize() {
       
        this.data.forEach((item) => {
            const words = this.tokenizer(item.name_processed);
            const tfid_vector = {};
            
            words.forEach((word) => {
                if (this.tfid_dict.hasOwnProperty(word)) {
                    if (!tfid_vector.hasOwnProperty(word)) {
                        tfid_vector[word] = 0;
                    }
                    
                    tfid_vector[word] = this.tfid_dict[word];
                }

            });
            
            this.vectorize_dict.push(tfid_vector);
        });
    }


    tfid_transform(term) {
        const tokens = this.tokenizer(term);
        const term_tfid = {};

        tokens.forEach((word) => {
            if (this.tfid_dict.hasOwnProperty(word)) {
                if (!term_tfid.hasOwnProperty(word)) {
                    term_tfid[word] = this.tfid_dict[word];
                } else {
                    term_tfid[word] += this.tfid_dict[word];
                }
                
            } else {
                term_tfid[word] = 0;
            }
        });

        return term_tfid;
    }

    add(A, B, weight=1) {
        Object.keys(B).forEach((element) =>  {
            if (A.hasOwnProperty(element)) {
                A[element] += weight*(this.tfid_dict[element] * B[element]);
                console.log(element+ ": " +this.tfid_dict[element]);
            } else {
                console.log(element+ ": " +(this.tfid_dict[element]*B[element]));
                A[element] = weight*(this.tfid_dict[element] * B[element]);
            }
        });
    }

    multiply(A,B, weight=1) {
        Object.keys(B).forEach((element) =>  {
            if (A.hasOwnProperty(element)) {
                A[element] *= weight*(this.tfid_dict[element] * B[element]);
                console.log(element+ ": " +(this.tfid_dict[element]*B[element]));
            }
        });

    }

    /*
    weightedSearch(term, max_results, recommendations) {
        const search_vector = this.tfid_transform(term);
        this.add(search_vector, recommendations.colors);
        
        this.multiply(search_vector, recommendations.clothes);

        let results = [];
        this.vectorize_dict.forEach((doc_vector, index) => {
            const score = this.cosine_simularity(search_vector, doc_vector);
            results.push({ index: index, score: score });
        });
        // perform ranking
        results.sort((a, b) => b.score - a.score);

        let ret = [];
        let message = "";
        for (let i =0;i < max_results; i++) {
            if (results[i].score >= 0.1) {
                let index = results[i].index;
                ret.push(this.data[index]);
            } else {
                message = "maxed";
            }
            
        }
        return {ret:ret, message:message};
    }
    */

    filterAndSort(vector, max_r, weight=0.1) {
        let results = [];
        let ret = [];
        this.vectorize_dict.forEach((doc_vector, index) => {
            const score = this.cosine_simularity(vector, doc_vector);
            results.push({ index: index, score: score });
        });
        results.sort((a, b) => b.score - a.score);

        for (let i =0;i < max_r; i++) {
            if (results[i].score >= weight) {
                let index = results[i].index;
                ret.push(this.data[index]);
            } 
        }
        return ret;
    }

    search(term, max_results) {
        //const newTerm = this.findClosestPairing(term);

        const search_vector = this.tfid_transform(term);
        const A = max_results;
        //const B = max_results / 2;
        const ret = this.filterAndSort(search_vector,A,0.1)
        
        //const new_vector = this.tfid_transform(newTerm);

        //const newRet = this.filterAndSort(new_vector,max_results-ret.length,0.1);

        let combinedRet = ret;
        /*
        for (let i=0;i<ret.length;i++) {
            combinedRet.push(ret[i]);
        }
        */
        /*
        for (let i=0;i<newRet.length;i++) {
            combinedRet.push(newRet[i]);
        }
        */
        
        let message = "";
        
        return {ret:combinedRet, message:message};
    }


    //https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html
    // Use 
    cosine_simularity(search_term, matrix) {
        // use keys to access matrix elements and perform dot product operations
        const dotProduct = Object.keys(search_term).reduce((sum, key) => {
            if (matrix.hasOwnProperty(key)) {
                return sum + (search_term[key] * matrix[key]);
            }
            return sum;
        }, 0);
        
        const m1 = Math.sqrt(Object.values(search_term).reduce((sum, val) => sum + (val * val), 0));
        const m2 = Math.sqrt(Object.values(matrix).reduce((sum, val) => sum + (val * val), 0));

        if (m1 === 0 || m2 === 0) return 0; // prevent div by 0

        return dotProduct / (m1 * m2);
        
    }


    cluster_preprocess_count() { 
        this.cluster_data.forEach((item) => {
           let words = item.values;
            words.forEach((word) => {
                if (this.cluster_count.hasOwnProperty(word)) {
                    this.cluster_count[word]+=1;
                } else {
                    this.cluster_count[word] = 1;
                }
                this.cluster_total_num += 1;
            });
        });
    }

    cluster_tfid_fit_transform() {
        Object.keys(this.cluster_count).forEach((word) => {
            this.cluster_tfid_dict[word] = Math.log((this.cluster_total_num+1)/(this.cluster_count[word]+1)) + 1;
        });
        this.cluster_tfid_vectorize();

    }

    cluster_tfid_vectorize() {
        this.cluster_data.forEach((item) => {
            let words = item.values;
            const tfid_vector = {};
            words.forEach((word) => {
                if (this.cluster_tfid_dict.hasOwnProperty(word)) {
                    if (!tfid_vector.hasOwnProperty(word)) {
                        tfid_vector[word] = 0;
                    }
                    tfid_vector[word] += this.tfid_dict[word];
                }
            });
            this.cluster_vectorize_dict.push(tfid_vector);
        });
    }

    cluster_tfid_transform(term) {
        const tokens = this.tokenizer(term);
        const term_tfid = {};

        tokens.forEach((item) => {
            let word = item;
            if (this.cluster_tfid_dict.hasOwnProperty(word)) {

                if (!term_tfid.hasOwnProperty(word)) {
                    term_tfid[word] = this.cluster_tfid_dict[word];
                } else {
                    term_tfid[word] += this.cluster_tfid_dict[word];
                }
                
            } else {
                word = this.spellcheck(word);
                term_tfid[word] = this.cluster_tfid_dict[word];
            }
        });
        
        return term_tfid;
    }

    euclidean(point) {
        let distances = [];

        this.cluster_vectorize_dict.forEach((row,index) => {
            const distance = Object.keys(point).reduce((sum, key) => {
                if (row.hasOwnProperty(key)) {
                    return sum + (Math.pow(point[key] - row[key],2));
                }
                return sum
            }, 0);
            distances.push({index:index, score:Math.sqrt(distance)});
            
        });

        return distances;
    }

    findClosestPairing(term) {
        
        const vector = this.cluster_tfid_transform(term);
        let results = [];
        
        this.cluster_vectorize_dict.forEach((doc_vector, index) => {
            const score = this.cosine_simularity(vector, doc_vector);
            results.push({ index: index, score: score });
        });
        
        //results = this.euclidean(vector);
        results.sort((a, b) => b.score - a.score);
        let ret = "";
        if (results[0].score < 0.1) {
            return ret;
        }
        let index = results[0].index;
        const cluster = this.cluster_data[index];
        for (let i = 0;i < cluster.values.length && i<10; i++) {
            ret+=cluster.values[i];
            ret+= " "; 
            
        }
        console.log(ret);
        
        return ret;

        
    }





}

function seperate(data) {
    let male_data = [];
    let female_data = [];
    data.forEach((row) => {
        const gender = row.gender;
        if (gender == "female") {
            female_data.push(row);
        } else {
            male_data.push(row);
        }

    });
    return {female_data, male_data};

}



const engine = new Engine();
const male_clothing_engine = new Engine();
const female_clothing_engine = new Engine();

parentPort.on('message', (msg) => {
    if (msg.type === 'start') {
        const { documents } = msg.task;
        engine.start(documents);
        const {female_data, male_data } = seperate(documents);
        male_clothing_engine.start(male_data);
        female_clothing_engine.start(female_data);
        parentPort.postMessage({ type: 'loaded' });

    } else if (msg.type === 'query') {
        console.log("Running Standard Query!");
        const { id, field, max_results } = msg.task;
        if (engine.vectorize_dict.length == 0) {
            const results = [];
            parentPort.postMessage({ type: `queryResult+${id}`, results });
        }  else {
            const result = engine.search(field,max_results);
            console.log('Worker sending results for request ID:', id);
            parentPort.postMessage({ type: `queryResult+${id}`, result });
        }
        
    } else if (msg.type === 'spellcheck') {
        const term = msg.task;
        const result = engine.spellcheck(term);
        parentPort.postMessage({type: 'spellResult', result });

        
    } else if (msg.type === 'gendered_query') {
        const { id, field, max_results, type } = msg.task;
        if (male_clothing_engine.vectorize_dict.length == 0 || female_clothing_engine.vectorize_dict.length == 0) {
            const results = [];
            parentPort.postMessage({ type: `queryGendered+${id}`, results });
        }  else {
            if (type == "female") {
                const result = female_clothing_engine.search(field,max_results);
                parentPort.postMessage({ type: `queryGendered+${id}`, result });
            } else if (type == "male") {
                const result = male_clothing_engine.search(field,max_results);
                parentPort.postMessage({ type: `queryGendered+${id}`, result });
            } else {
                const result = engine.search(field,max_results);
                parentPort.postMessage({ type: `queryGendered+${id}`, result });
            }
            
            
        }

    }
    
});


//module.exports = Engine;