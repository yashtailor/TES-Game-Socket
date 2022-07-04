function inc_value(idx,points){
    console.log(idx);
    let cur_score = parseInt(document.getElementById('team'+idx).innerHTML);
    document.getElementById('team'+idx).innerHTML = cur_score + points;
}
function add_team(){
    let team_name = document.getElementById('team_name').value;
    let new_team_outer_div = document.createElement('div');
    let idx = document.getElementsByClassName('teams_ctx').length + 1;
    console.log(idx);
    new_team_outer_div.className = 'columns teams_ctx';
    let new_span_elem = document.createElement('input');
    new_span_elem.style.background = 'transparent';
    new_span_elem.style.border = 'none';
    let new_score_elem = document.createElement('span');
    let new_color_picker = document.createElement('input');
    new_color_picker.type = 'color';
    new_color_picker.value = '#00FF26';
    new_color_picker.style.margin = '2px';
    new_color_picker.style.height = 'inherit';
    new_color_picker.id = 'color'+idx;
    new_color_picker.addEventListener('change',function(e){
        console.log(e);
        let idx = parseInt(e.target.id[e.target.id.length-1]);
        console.log(idx);
        let cur_team = JSON.parse(localStorage.getItem(idx));
        cur_team.bgcolor = e.target.value;
        localStorage.setItem(idx,JSON.stringify(cur_team));
        localStorage.setItem('whoseColorChanged',idx);
        localStorage.setItem('whichColorChanged',e.target.value);
        localStorage.setItem('colorChanged',true);
    })
    new_span_elem.className = 'column is-two-fifths';
    new_score_elem.className = 'column is-one-fifth tag is-link';
    let new_add_25 = document.createElement('button');
    let new_add_50 = document.createElement('button');
    let new_add_75 = document.createElement('button');
    let new_add_25_minus = document.createElement('button');
    let new_add_50_minus = document.createElement('button');
    let new_add_75_minus = document.createElement('button');
    let del_btn = document.createElement('button');
    del_btn.className = 'delete is-medium';
    del_btn.id = 'del'+idx;
    del_btn.addEventListener('click',function(e){
        let sure = confirm('Are you sure you want to delete it?');
        console.log(sure);
        if(sure == true){
            localStorage.setItem('idxDel',idx);
            localStorage.setItem('toDelete',"true");
            console.log('in sure',idx);
            document.getElementsByClassName('teams_ctx')[idx-1].style.display = 'none';
        }
    })
    new_add_25.innerText = '+25';
    new_add_25.id=idx+'button25';                                   
    new_add_50.innerText = '+50';
    new_add_50.id=idx+'button50';
    new_add_75.innerText = '+75';
    new_add_75.id=idx+'button75m';
    new_add_25_minus.innerText = '-25';
    new_add_25_minus.id=idx+'button25m';                                   
    new_add_50_minus.innerText = '-50';
    new_add_50_minus.id=idx+'button50m';
    new_add_75_minus.innerText = '-75';
    new_add_75_minus.id=idx+'button75';
    new_score_elem.innerHTML = '0';
    new_score_elem.id = 'team'+idx;
    new_score_elem.style.fontSize = '1.3em';
    new_span_elem.style.fontSize = '1.3em';
    new_add_25.className = 'button is-primary column';
    new_add_25.style.margin = '3px';
    new_add_25.addEventListener('click',()=>{
        let cur_score = parseInt(document.getElementById('team'+idx).innerHTML);
        document.getElementById('team'+idx).innerHTML = cur_score + 25;
        let that_idx_obj = JSON.parse(localStorage.getItem(idx));
        that_idx_obj.score = cur_score + 25;
        localStorage.setItem(idx,JSON.stringify(that_idx_obj));
    })
    new_add_50.className = 'button is-info column';
    new_add_50.style.margin = '3px';
    new_add_50.addEventListener('click',()=>{
        let cur_score = parseInt(document.getElementById('team'+idx).innerHTML);
        document.getElementById('team'+idx).innerHTML = cur_score + 50;
        let that_idx_obj = JSON.parse(localStorage.getItem(idx));
        that_idx_obj.score = cur_score + 50;
        localStorage.setItem(idx,JSON.stringify(that_idx_obj));
    })
    new_add_75.className = 'button is-danger column';
    new_add_75.style.margin = '3px';
    new_add_75.addEventListener('click',()=>{
        let cur_score = parseInt(document.getElementById('team'+idx).innerHTML);
        document.getElementById('team'+idx).innerHTML = cur_score + 75;
        let that_idx_obj = JSON.parse(localStorage.getItem(idx));
        that_idx_obj.score = cur_score + 75;
        localStorage.setItem(idx,JSON.stringify(that_idx_obj));
    })
    
    new_add_25_minus.className = 'button is-primary column';
    new_add_25_minus.style.margin = '3px';
    new_add_25_minus.addEventListener('click',()=>{
        let cur_score = parseInt(document.getElementById('team'+idx).innerHTML);
        document.getElementById('team'+idx).innerHTML = cur_score - 25;
        let that_idx_obj = JSON.parse(localStorage.getItem(idx));
        that_idx_obj.score = cur_score - 25;
        localStorage.setItem(idx,JSON.stringify(that_idx_obj));
    })
    new_add_50_minus.className = 'button is-info column';
    new_add_50_minus.style.margin = '3px';
    new_add_50_minus.addEventListener('click',()=>{
        let cur_score = parseInt(document.getElementById('team'+idx).innerHTML);
        document.getElementById('team'+idx).innerHTML = cur_score - 50;
        let that_idx_obj = JSON.parse(localStorage.getItem(idx));
        that_idx_obj.score = cur_score - 50;
        localStorage.setItem(idx,JSON.stringify(that_idx_obj));
    })
    new_add_75_minus.className = 'button is-danger column';
    new_add_75_minus.style.margin = '3px';
    new_add_75_minus.addEventListener('click',()=>{
        let cur_score = parseInt(document.getElementById('team'+idx).innerHTML);
        document.getElementById('team'+idx).innerHTML = cur_score - 75;
        let that_idx_obj = JSON.parse(localStorage.getItem(idx));
        that_idx_obj.score = cur_score - 75;
        localStorage.setItem(idx,JSON.stringify(that_idx_obj));
    })

    new_span_elem.value = team_name;
    new_span_elem.style.color = 'white';
    new_span_elem.style.marginRight = '5px';
    new_span_elem.id = 'tname'+idx;
    new_span_elem.addEventListener('change',function(){
        let team = JSON.parse(localStorage.getItem(idx));
        team.name = document.getElementById('tname'+idx).value;
        localStorage.setItem(idx,JSON.stringify(team));
        localStorage.setItem('whoseNameChanged',idx);
        localStorage.setItem('whatNameChanged',team.name);
        localStorage.setItem('hasNameChanged',"true");
    })
    new_team_outer_div.appendChild(new_span_elem);
    new_team_outer_div.appendChild(new_score_elem);
    new_team_outer_div.appendChild(new_color_picker);
    new_team_outer_div.appendChild(new_add_25);
    new_team_outer_div.appendChild(new_add_50);
    new_team_outer_div.appendChild(new_add_75);
    new_team_outer_div.appendChild(new_add_25_minus);
    new_team_outer_div.appendChild(new_add_50_minus);
    new_team_outer_div.appendChild(new_add_75_minus);
    new_team_outer_div.appendChild(del_btn);
    new_team_outer_div.style.padding = '0.5em';
    new_team_outer_div.style.border = '2px solid white';
    // new_team_outer_div.style.background = 'linear-gradient(to right, #4ef884 50%, #e62087 50%)';
    let main_div = document.getElementById('teams');
    main_div.appendChild(new_team_outer_div)
    // document.getElementById('lol').innerHTML = 'lol'+Math.random();
    let new_team_obj = {
        'name':team_name,
        'score':0,
        'bgcolor':'#00FF26'
    }
    localStorage.setItem(idx,JSON.stringify(new_team_obj));
}