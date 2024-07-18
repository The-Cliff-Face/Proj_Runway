const { stopwords } = require('stopword');
const { closest } = require('fastest-levenshtein');
const { parentPort } = require('worker_threads');
const { SVD } = require('svd-js');

var linearAlgebra = require('linear-algebra')(),     
    Vector = linearAlgebra.Vector,
    Matrix = linearAlgebra.Matrix;


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

    start(data,clusterData) {
        this.data = data;
        this.cluster_data = clusterData;
        this.preprocess_count();
        this.tfid_fit_transform();
        this.cluster_preprocess_count();
        this.cluster_tfid_fit_transform();
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


    search(term, max_results) {
        const newTerm = this.findClosestPairing(term);
        
        const search_vector = this.tfid_transform(newTerm + " " + term);
        
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
        for (let i = 0;i < cluster.values.length && i<3; i++) {
            ret+=cluster.values[i];
            ret+= " "; 
            
        }
        console.log(ret);
        
        return ret;

        
    }





}



const engine = new Engine();

parentPort.on('message', (msg) => {
    if (msg.type === 'start') {
        const { documents, clusters } = msg.task;
        engine.start(documents, clusters);
        parentPort.postMessage({ type: 'loaded' });
    } else if (msg.type === 'query') {
        console.log("Running Standard Query!");
        const { field, max_results } = msg.task;
        if (engine.vectorize_dict.length == 0) {
            const results = [];
            parentPort.postMessage({ type: 'queryResult', results });
        }  else {
            const result = engine.search(field,max_results);
            parentPort.postMessage({ type: 'queryResult', result });
        }
        
    } else if (msg.type === 'spellcheck') {
        const term = msg.task;
        const result = engine.spellcheck(term);
        parentPort.postMessage({type: 'spellResult', result });

    } else if (msg.type === 'weightedQuery') {
        console.log("Running Weighted Query!");
        const { field, max_results, recommendation } = msg.task;
        if (engine.vectorize_dict.length == 0) {
            const results = [];
            parentPort.postMessage({ type: 'queryWeightedResult', results });
        }  else {
            const result = engine.weightedSearch(field,max_results,recommendation);
            parentPort.postMessage({ type: 'queryWeightedResult', result });
        }

    }
    
});


//module.exports = Engine;