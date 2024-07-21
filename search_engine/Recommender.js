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
            "female": ["girl","women", "womens", "womans", "girly", "women", "woman", "girls"],
            "male": ["boy", "man", "men", "mens", "boys", "manly"],
            "black": ["dark", "charcoal"],
            "blue": ["indigo", "sky", "navy"],
            "red": ["crimson", "maroon"],
            "yellow": ["gold", "cream", "khaki", "peach", "mustard"],
            "pink": ["magenta", "rose"],
            "white": ["light", "cream"],
            "brown": ["khaki", "nude", "tan", "beige", "coffee", "bronze"],
            "green": ["lime", "army", "olive", "sage", "jade"],
            "purple": ["voilet", "lavender", "mauve"],
            "orange": ["peach", "coral", "bronze"],
            "gray": ["silver", "grey"],
            "teal": ["turquoise", "sea", "blue", "green", "jade"],
            "trousers": ["pants", "corduroy", "bottoms"],
            "tanks": ["top", "sleeveless", "cami", "camisole", "halter", "halterneck", "tank", "strapless", "spaghetti"],
            "skirts": ["skirt", "skort"],
            "shorts": ["skort"],
            "tshirts": ["tees", "tee", "tshirt"],
            "jeans": ["denim", "jean"],
            "dresses": ["dress", "romper", "gown", "maxi", "midi", "jumpsuit"],
            "hoodies": ["hoodie", "sweatshirt", "hood", "zip up", "fleece", "pullover", "jacket"],
            "sweaters": ["sweater", "knit", "cardigan", "vest", "wool", "crochet"],
            "coats": ["coat", "blazer", "suit", "jacket", "winter", "overcoat", "trench"],
            "blouses": ["flowy", "shirt", "blouse"],
            "sweatpants": ["jogger", "joggers", "sweatpant"]
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

    add(term_tfid, object, theta) {
        
        Object.keys(object).forEach((word) => {

            if (word=="gender") {
                // do nothing
                 
            } else if (this.synonyms.hasOwnProperty(word)) {
                const weight = theta;
                term_tfid[word] = object[word] * theta;
                for (let i=0;i<this.synonyms[word].length;i++) {
                    const syn = this.synonyms[word][i];

                    if (!term_tfid.hasOwnProperty(syn) && this.tfid_dict.hasOwnProperty(syn)) {
                        term_tfid[syn] = this.tfid_dict[syn] * weight;
                    } else if (this.tfid_dict.hasOwnProperty(syn)) {
                        term_tfid[syn] += this.tfid_dict[syn] * weight;
                    } else {
                        term_tfid[syn] = weight;
                    }
                }

                
            } else {
                term_tfid[word] = object[word] * theta;
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
                term_tfid[word] = weight;
            }

            if (this.synonyms.hasOwnProperty(word)) {
                    
                for (let i=0;i<this.synonyms[word].length;i++) {
                    const syn = this.synonyms[word][i];

                    if (!term_tfid.hasOwnProperty(syn) && this.tfid_dict.hasOwnProperty(syn)) {
                        term_tfid[syn] = this.tfid_dict[syn] * weight;
                    } else if (this.tfid_dict.hasOwnProperty(syn)) {
                        term_tfid[syn] += this.tfid_dict[syn] * weight;
                    } else {
                        term_tfid[syn] = weight;
                    }
                }
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

    combineVectors(vector1, vector2) {
        let combinedVector = { ...vector1 };
        for (let key in vector2) {
            console.log(key);
          if (combinedVector[key]) {
            combinedVector[key] += vector2[key];
          } else {
            combinedVector[key] = vector2[key];
          }
        }
        return combinedVector;
      }



    recommend(userRec) {
        // userRec has colors, clothes, and other
        let userVector = {};
        
        this.tfid_transform(userVector,userRec.clothes, 2.5);
        this.tfid_transform(userVector,userRec.colors, 1);
        let newVector = {};
        this.add(newVector, userRec.other, 2);
        
        let combinedVector = this.combineVectors(userVector, newVector);
        
        try {
            const r = this.vectorize_dict[6];

        } catch (error) {
            return {ret:[], message:"failed"};
        }
        console.log(combinedVector);
        
        let results = [];
        this.vectorize_dict.forEach((doc_vector, index) => {
            const score = this.cosine_simularity(combinedVector, doc_vector);
            results.push({ index: index, score: score });
        });
        // perform ranking
        results.sort((a, b) => b.score - a.score);

        let ret = [];
        for (let i=0;i<this.MAX_RESULTS;i++) {
            let index = results[i].index;
            let score = results[i].score;
            ret.push({data:this.data[index], score:score});
        }
        
        let message = "";
        
        return {ret:ret, message:message};

    }

}

const Engine = new Recommender();
const female_engine = new Recommender();
const male_engine = new Recommender();

parentPort.on('message', (msg) => {
    if (msg.type == "start") {
        const { clusters, male_clusters_data, female_cluster_data } = msg.task;
        Engine.start(clusters);
        female_engine.start(female_cluster_data);
        male_engine.start(male_clusters_data);
        parentPort.postMessage({ type: 'loaded' });

    } else if (msg.type == "recommend") {
        const { rec, type } = msg.task;
        if (type == "female") {
            const results = female_engine.recommend(rec);
            parentPort.postMessage({ type: 'recommendResult', results });
        } else if (type == "male") {
            const results = male_engine.recommend(rec);
            parentPort.postMessage({ type: 'recommendResult', results });
        } else {
            const results = Engine.recommend(rec);
            parentPort.postMessage({ type: 'recommendResult', results });
        }
        
    }
   
    
});