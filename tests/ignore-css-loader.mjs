const emptyModuleUrl = "data:text/javascript,export default {}";

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "animate.css" || specifier.endsWith(".css")) {
    return {
      url: emptyModuleUrl,
      shortCircuit: true
    };
  }

  return nextResolve(specifier, context);
}
