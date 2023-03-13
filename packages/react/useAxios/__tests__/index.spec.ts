import type { RawAxiosRequestConfig } from 'axios'
import { act, renderHook } from '@testing-library/react-hooks'
import { useAxios, useAxiosCreate } from '../index'

describe('useAxios', () => {
  const url = 'https://jsonplaceholder.typicode.com/todos/1'
  const config: RawAxiosRequestConfig = {
    method: 'GET',
  }

  const testInstance = useAxiosCreate({
    baseURL: 'https://jsonplaceholder.typicode.com',
  })

  const finalInstance = useAxiosCreate()

  const options = { immediate: false }
  const path = '/todos/1'

  test('params: url with await', async () => {
    const { result } = renderHook(() => useAxios(url))

    // result.current.then((r) => {
    // })
    await act(async () => {
      const r = await result.current
      // console.log(r)
    })

    // act(() => {
    //   result.current.then((v) => {
    //     console.log(v)
    //   })
    // })

    // const re = await result.current
    // console.log(re)
  })

  // test('params: url with then', async () => {
  //   useAxios(url).then(({ loading, data }) => {
  //     expect(loading).toBeFalsy()
  //     expect(data.id).toBe(1)
  //   })
  // })

  // test('params: url without await and then', async () => {
  //   const res = useAxios(url)

  //   expect(res.loading).toBeTruthy()
  //   res.then(() => {
  //     expect(res.loading).toBeFalsy()
  //     expect(res.data.id).toBe(1)
  //   })
  // })

  // test('use custom instance', async () => {
  //   const { loading, data } = await useAxios(path, {
  //     controller: {
  //       instance: testInstance,
  //     },
  //   })
  //   expect(loading).toBeFalsy()
  //   expect(data.id).toBe(1)
  // })
})
