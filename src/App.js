import logo from './logo.svg'
import './App.css'
import React, { useEffect, useState } from 'react'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import humanNumber from 'human-number'
TimeAgo.addDefaultLocale(en)
function App () {
  const timeAgo = new TimeAgo('en-US')
  var page = 1,
    scroll = true,
    itemsCount = 0,
    itemsCountTemp = 0,
    [json, setJson] = useState({}),
    [items, setItems] = useState([]),
    items_temp = []
  const data = (e, k) => {
    if (k.length > 0) if (e[k] != null) if (e[k] != undefined) return e[k]
    return '*' + k.charAt(0).toUpperCase() + k.slice(1) + ' Was Not Found*'
  }

  const get_data = () => {
    var pageNum = ''
    if (page > 1) pageNum = '&page=' + page
    fetch(
      'https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc' +
        pageNum
    )
      .then(res => res.json())
      .then(
        r => {
          if (r.items != undefined)
            r.items.forEach(e => {
              items_temp.push(
                <div className='repo' key={e.id}>
                  <div className='avatar'>
                    <img
                      src={data(e.owner, 'avatar_url')}
                      alt={data(e.owner, 'login')}
                    />
                  </div>
                  <div className='repo-details'>
                    <h1>{data(e, 'name')}</h1>
                    <p>{data(e, 'description')}</p>
                    <div>
                      <span>
                        Stars: {humanNumber(data(e, 'stargazers_count'))}
                      </span>
                      <span>Issues: {humanNumber(data(e, 'open_issues'))}</span>
                      <small>
                        Submitted{' '}
                        {timeAgo.format(new Date(data(e, 'created_at'))) +
                          ' By ' +
                          data(e.owner, 'login')}
                      </small>
                    </div>
                  </div>
                </div>
              )
            })
          setItems([...items_temp])
          itemsCount = items_temp.length

          if (itemsCount > itemsCountTemp) {
            scroll = true
            itemsCountTemp = items_temp.length
          }
        },
        e => {
          console.log(e)
          document.getElementById('loading').innerHTML = '*No More Repos*'
        }
      )
  }
  function get_more (e) {
    var windowHeight =
      window.innerHeight || document.documentElement.clientHeight
    if (
      window.scrollY >=
        document.body.scrollHeight -
          document.body.scrollHeight * 0.15 -
          windowHeight &&
      scroll
    ) {
      page++
      get_data()

      scroll = false
    }
  }
  useEffect(() => {
    get_data()
    document.addEventListener('wheel', get_more)
  }, [])
  return (
    <div className='App'>
      {items}
      <div id='loading'>Loading...</div>
    </div>
  )
}

export default App
