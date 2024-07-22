const { stopwords } = require('stopword');
const { closest } = require('fastest-levenshtein');
const { parentPort } = require('worker_threads');


class Synonyms {
    constructor() {
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
            "shirts": ["shirt","tops","collared"],
            "jeans": ["denim", "jean"],
            "dresses": ["dress", "romper", "gown", "maxi", "midi", "jumpsuit"],
            "hoodies": ["hoodie", "sweatshirt", "hood", "zip up", "fleece", "pullover", "jacket"],
            "sweaters": ["sweater", "knit", "cardigan", "vest", "wool", "crochet"],
            "coats": ["coat", "blazer", "suit", "jacket", "winter", "overcoat", "trench"],
            "blouses": ["flowy", "shirt", "blouse"],
            "sweatpants": ["jogger", "joggers", "sweatpant"]
        };
        this.synonymLookup = {};
        this.initialize();

    }
    initialize() {
        for (const group in this.synonyms) {
            this.synonyms[group].forEach(synonym => {
                this.synonymLookup[synonym] = group;
            });
        }
    }
    findSynonyms(word) {
        const group = this.synonymLookup[word];
        return group ? this.synonyms[group] : [];
    }

}



// source: https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html
class Engine {
    constructor() {
        this.data = [];
        this.count_dict = {};
        this.tfid_dict = {}; 
        this.vectorize_dict = [];
        this.total_num = 0;
        this.synonyms = new Synonyms();


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

    filterAndSort(vector, max_r, weight=0.1) {
        let results = [];
        let ret = [];
        this.vectorize_dict.forEach((doc_vector, index) => {
            const score = this.cosine_simularity(vector, doc_vector);
            results.push({ index: index, score: score });
        });
        results.sort((a, b) => b.score - a.score);

        for (let i =0;i < max_r && i<results.length; i++) {
            if (results[i].score >= weight) {
                let index = results[i].index;
                ret.push(this.data[index]);
            } 
        }
        return ret;
    }

    rebuildAndConcat(data) {
        this.data = this.data.concat(data);
        this.preprocess_count();
        this.tfid_fit_transform();
    }

    considerAlternateWords(term_tfid) {
        Object.keys(term_tfid).forEach((word) => {

            const syns = this.synonyms.findSynonyms(word);
            syns.forEach((syn) => {
                if (this.tfid_dict.hasOwnProperty(syn)) {
                    if (!term_tfid.hasOwnProperty(syn)) {
                        term_tfid[syn] = this.tfid_dict[syn];
                    } else {
                        term_tfid[syn] += this.tfid_dict[syn];
                    }
                    
                } else {
                    term_tfid[syn] = 0;
                }
            });
            if (!this.tfid_dict.hasOwnProperty(word)) {
                const new_word = this.spellcheck(word);
                term_tfid[new_word] = this.tfid_dict[new_word];
            }
            

        });
    }

    search(term, max_results) {

        const search_vector = this.tfid_transform(term);
        this.considerAlternateWords(search_vector);
        const A = max_results;
        const ret = this.filterAndSort(search_vector,A,0.1);
        let combinedRet = ret;
        
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

}

function seperate(data) {
    let male_data = [];
    let female_data = [];
    data.forEach((row) => {
        const gender = row.gender;
        
        if (gender == 1) {
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
    
    } else if (msg.type == "build") {
        const { documents } = msg.task;
        const {female_data, male_data } = seperate(documents);
        engine.rebuildAndConcat(documents);
        male_clothing_engine.rebuildAndConcat(male_data);
        female_clothing_engine.rebuildAndConcat(female_data);
        parentPort.postMessage({ type: 'finished_build' });


    } else if (msg.type === 'query') {
        console.log("Running Standard Query!");
        const { id, field, max_results } = msg.task;
        if (engine.vectorize_dict.length == 0) {
            const results = [];
            console.log('Failed: Worker sending results for request ID:', id);
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
        if (male_clothing_engine.vectorize_dict.length == 0 && female_clothing_engine.vectorize_dict.length == 0) {
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