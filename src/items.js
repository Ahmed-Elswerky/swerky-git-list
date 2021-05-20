import { useState, useEffect } from 'react'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import humanNumber from 'human-number'
TimeAgo.addDefaultLocale(en)
//--- A function to get the data from the git list items object, and return not found if there's no value
function data (e, k) {
  if (k.length > 0) if (e[k] !== null) if (e[k] !== undefined) return e[k]
  return '*' + k.charAt(0).toUpperCase() + k.slice(1) + ' Was Not Found*'
}
//--- Global variables
var itemsCount = 0,
  itemsCountTemp = 0,
  itemsTemp = []
var page = 1
var scroll = true
const timeAgo = new TimeAgo('en-US')
export default function Items (props) {
  var [items, setItems] = useState([])
  const get_data = () => {
    var pageNum = ''
    //--- If the numer of pages needed is greater than 1, and also the git list items count is more than 0
    if (page > 1 && itemsCount > 0) pageNum = '&page=' + page

    fetch(
      'https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc' +
        pageNum
    )
      .then(res => res.json())
      .then(
        r => {
          if (r.items !== undefined) {
            console.log(
              'get data of page:',
              page,
              ', number of elements:',
              r.items.length + itemsCount
            )
            r.items.forEach(e => {
              itemsTemp.push(
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
          }
          //--- Removing Duplicates
          itemsTemp.reduce((unique, o) => {
            if (!unique.some(obj => String(obj.key) === String(o.key))) {
              unique.push(o)
            }
            return unique
          }, [])
          setItems([...itemsTemp])
          console.log(itemsTemp)
          itemsCount = itemsTemp.length

          if (itemsCount > itemsCountTemp) {
            scroll = true

            itemsCountTemp = itemsTemp.length
          }
        },
        e => {
          console.log(e)
          document.getElementById('loading').innerHTML = '*No More Repos*'
        }
      )
  }
  //--- Initialize the data and scroll event once, when component loads
  useEffect(() => {
    //--- If the scroll is at the last 15% of the page, get more results (increase page value by 1)
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
        page = page + 1
        get_data()
        scroll = false
      }
    }
    get_data()
    document.addEventListener('wheel', get_more)
    return () => {
      document.removeEventListener('wheel', get_more)
    }
  }, [])
  return (
    <div className='App'>
      {items}
      <div id='loading'>Loading...</div>
      <br />
    </div>
  )
}
