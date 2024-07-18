'use client';
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from '/src/app/AuthContext.js';
import { useContext } from 'react';

const Connectors = createContext();

//https://www.telerik.com/blogs/react-basics-how-when-use-react-context
// modified to store only access tokens
const ConnectProvider = ({ children }) => {
    // AuthContext Hooks
    let { token } = useContext(AuthContext);
    let { username } = useContext(AuthContext);
    const { setUsername } = useContext(AuthContext);
    const { getUsername } = useContext(AuthContext);
    const { setToken } = useContext(AuthContext);
    const { refreshToken } = useContext(AuthContext);
    // -----

    // This Hooks:
    const [msg, setMessage] = useState({e:null, message:""});
    let [comments, setComments] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    let [likes, setLikes] = useState(0);
    const [itemData, setData] = useState([]);
    const [clusterItemData, setClusterData ] = useState([]); 
    const [didILikeIt, setDidI] = useState(false);
    const [clusterNames, setClusterNames] = useState([]);
    //------

    // Constants & Other:
    const max_results = 100;
    var bp = require('/src/app/Path.js');
    // ---

    
    const postComment = async (id) => {
        if (!id) return;
        if (!msg.e) {
          return;
        }
     
        if (!token) {
          const newToken = await refreshToken();
          token = newToken;
        }
     
        if (!username) {
          const user = await getUsername();
          username = user;
          setUsername(user);
        }
        
        var obj = { id: id, message: msg.message };
        var js = JSON.stringify(obj);
     
        try {
          const response = await fetch(bp.buildPath('api/postComment'), {
                  method:'POST',
                  body: js,
                  headers:{
                      'Content-Type': 'application/json',
                      "authorization": token,
                  }
              });
              var txt = await response.text();
          
        } catch (error) {
          console.log(error);
        }
        let tmp = comments;
        tmp.push({username:username, message:msg.message});
        setComments(tmp);
        msg.e.target.value = "";
     }


     const toggleLike = async (id) => {
        setIsLiked(!isLiked);

        if (!id) {return;}
      
        if (!isLiked) {
            
          setLikes(likes + 1); 
          await likeAction(id, 1);
                
        } else {
          setLikes(likes - 1); 
          await likeAction(id, -1);
        }
      };

      const likeAction = async (id,like) => {
        if (!id) return;
        
        if (!token) {
          const newToken = await refreshToken();
          token = newToken;
        }
        
        var obj = { id: id, like: like};
        var js = JSON.stringify(obj);
      
        try {
          const response = await fetch(bp.buildPath('api/like'), {
                  method:'POST',
                  body: js,
                  headers:{
                      'Content-Type': 'application/json',
                      "authorization": token,
                  }
              });
              var txt = await response.text();
          
        } catch (error) {
          console.log(error);
        }
      
      }


      const fetchComments = async (id) => {
        if (!id) return;

        if (!token) {
            const newToken = await refreshToken();
            token = newToken;
        }
        if (!username) {
            const user = await getUsername();
            username = user;
            setUsername(user);
        }

        
        var obj = { id: id };
        var js = JSON.stringify(obj);
        
        try {
            const response = await fetch(bp.buildPath('api/viewComments'), {
                method:'POST',
                body: js,
                headers:{
                    'Content-Type': 'application/json',
                    "authorization": token,
                }
            });
            var txt = await response.text();
            var res = JSON.parse(txt);
            if (res.error !== "") {
                console.log(res.error);
            }
            var _results = res.ret.comments;
            let l = res.likes;
            if (!res.likes) {
                l = 0;
            }
            let didL = false;
            let usersThatLiked = res.usersLiked;
            if (!usersThatLiked) {
                usersThatLiked = [];
            }
            if (usersThatLiked.includes(username)) {
                didL = true;
            } 

            setComments(_results);
            setLikes(l);
            return didL;


            
        } catch (error) {
            console.log(error);
        }
    };

    const truncateTitle = (title) => {
        if (title.length > 30) {
            return title.substring(0, 30) + '...';
        }
        return title;
    };

    const search = async (searchTerm, m_results=100) => {
        if (!token) {
            const newToken = await refreshToken();
            setToken(newToken);
            token = newToken;
              
        }
            
        setData([]); // refresh the data
            
        var obj = {search:searchTerm,max_results:m_results};
        var js = JSON.stringify(obj);
  
        try
        {
            let response = await fetch(bp.buildPath('api/search'),
            {method:'POST',body:js , 
                headers:{
                    'Content-Type': 'application/json',
                    "authorization": token,
            }});
                  
                
    
            var txt = await response.text();
            var res = JSON.parse(txt);
            if (res.error != "") {
                console.log(res.error);
            }
            var _results = res.results.ret;
               
            var entries = [];
            for( var i=0; i<_results.length; i++ )
            {   
                    
                const product = _results[i];
                // i hate this so much, idk what is going on
                let images = "";
                if (Array.from(product.images)[0] == '[') {
                    images = product.images.slice(1, -1).split(',').map(item => item.slice(1, -1));
                    for (let j=0;j<images.length;j++) {
                        const temp = images[j];
                        if (temp[0] == "'") {
                            let h = temp.split("'");
                            images[j] = h[1];
                        }
                    }

                } else {
                    images = [product.images];
                }
                    
                const image = images;
                const entry = {
                    "img":image,
                    "title":product.name,
                    "id":product.id,
                }
                entries.push(entry);
                  
                }
                
                setData(entries);
                return entries;
                
        }
        catch(e)
        {
            console.log(e.toString());
            
        }

    };


    const grabRecommendedClusters = async () => {
        
 
        if (!token) {
         const newToken = await refreshToken();
         token = newToken;
         
       }
 
        try
            {
                const response = await fetch(bp.buildPath('api/recommend'),
                {method:'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        "authorization": token,
                    }});
   
                var txt = await response.text();
                var res = JSON.parse(txt);
                if (res.error != "") {
                    console.log(res.error);
                }
                console.log(res);
                
                let resultantItemData = [];
                let clusNames = [];
                for (let i=0;i< 3;i++) {
                    var _results = res.results.ret[i].values;
                    clusNames.push(_results);
                    let searchString = "";
                    for( var j=0; j<_results.length; j++ )
                    {  
                        searchString += _results[j];
                        searchString += " ";
                        
                    }
                    const entries = await search(searchString, 10); // modifies itemData
                    resultantItemData.push(entries);

                }
                setClusterNames(clusNames);
                setClusterData(resultantItemData); 
                console.log(resultantItemData);
               
            }
            catch(e)
            {
                console.log(e.toString());
               
            }
     };

  
    const value = {
        postComment,
        toggleLike,
        fetchComments,
        truncateTitle,
        grabRecommendedClusters,
        clusterItemData,
        search,
        itemData,
        setData,
        msg,
        comments,
        setMessage,
        likes,
        isLiked,
        didILikeIt,
        clusterNames,
    };
  
    return <Connectors.Provider value={value}>{children}</Connectors.Provider>;
  };
  
  export { Connectors, ConnectProvider };