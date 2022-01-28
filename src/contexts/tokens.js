export const TokensContext = createContext({
  list: [],
  loading: false,
  toggleDirection: () => {},
  finishStep: () => {}
});

export function TokensProvider({ children = undefined}) {
  return <TokensContext.Provider
    value={{list, loading}}>
    {children}
  </TokensContext.Provider>
}