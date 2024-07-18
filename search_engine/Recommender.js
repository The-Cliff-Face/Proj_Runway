//const { initialize } = require("next/dist/server/lib/render-server");

const { parentPort } = require('worker_threads');


// the difference between this and the other search engine is that this does a cluster based search for aesthetic matching
// to be used with the regular search engine


class Recommender  {
    

    constructor() {
        
        this.data = [];
        this.count_dict = {};
        this.tfid_dict = {};
        this.vectorize_dict = [];
        this.max_iterations = 100;
        this.total_num = 0;
        this.MAX_RESULTS = 3;

        this.synonyms = {
            "female": ["girl","women", "womens", "womans", "girly"],
            "male": ["boy", "man", "men", "mens"]
        };

    }
    start(data) {
        this.data = data;
        this.preprocess_count();
        this.tfid_fit_transform();

    }

    preprocess_count() { 
        this.data.forEach((item) => {
           let words = item.values;
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

    tfid_fit_transform() {
        Object.keys(this.count_dict).forEach((word) => {
            this.tfid_dict[word] = Math.log((this.total_num+1)/(this.count_dict[word]+1)) + 1;
        });
        this.tfid_vectorize();


    }

    add(term_tfid, term, theta) {
        
        Object.keys(term).forEach((word) => {
            if (this.tfid_dict.hasOwnProperty(word)) {
                if (!term_tfid.hasOwnProperty(word)) {
                    term_tfid[word] = (this.tfid_dict[word]);
                } else {
                    term_tfid[word] += (this.tfid_dict[word]);
                }
                
            } else {
                term_tfid[word] = 0;
            }
        });
    }

    tfid_transform(term_tfid, term, theta) {
        
        Object.keys(term).forEach((word) => {
            let weight = term[word];
            weight*=theta;
            
            if (this.tfid_dict.hasOwnProperty(word)) {
                if (!term_tfid.hasOwnProperty(word)) {
                    term_tfid[word] = (this.tfid_dict[word] * weight);
                } else {
                    term_tfid[word] += (this.tfid_dict[word] * weight);
                }
                
            } else {
                term_tfid[word] = 0;
            }
        });

    }

    tfid_vectorize() {
        this.data.forEach((item) => {
            let words = item.values;
            const tfid_vector = {};
            words.forEach((word) => {
                if (this.tfid_dict.hasOwnProperty(word)) {
                    if (!tfid_vector.hasOwnProperty(word)) {
                        tfid_vector[word] = 0;
                    }
                    tfid_vector[word] += this.tfid_dict[word];
                }
            });
            this.vectorize_dict.push(tfid_vector);
        });
    }


    recommend(userRec) {
        // userRec has colors, clothes, and other
        
        const userVector = {};
        this.tfid_transform(userVector,userRec.clothes,2);
        this.tfid_transform(userVector,userRec.colors,1);
        //this.add(userVector,tmp,3);
        //this.tfid_transform(userVector.other,"string");
        console.log(userVector);

        let results = [];
        this.vectorize_dict.forEach((doc_vector, index) => {
            const score = this.cosine_simularity(userVector, doc_vector);
            results.push({ index: index, score: score });
        });
        // perform ranking
        results.sort((a, b) => b.score - a.score);

        let ret = [];
        for (let i=0;i<this.MAX_RESULTS;i++) {
            let index = results[i].index;
            let score = results[i].score;
            ret.push(this.data[index]);
            console.log("---");
            console.log(score);
            console.log("---");
            
            
        }
        console.log(ret);
        
        let message = "";
        
        return {ret:ret, message:message};

    }

}

const Engine = new Recommender();
parentPort.on('message', (msg) => {
    if (msg.type == "start") {
        Engine.start(msg.task);
        parentPort.postMessage({ type: 'loaded' });
    } else if (msg.type == "recommend") {
        const results = Engine.recommend(msg.task);
        parentPort.postMessage({ type: 'recommendResult', results });
        
    }
   
    
});