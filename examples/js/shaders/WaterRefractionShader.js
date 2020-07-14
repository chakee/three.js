console.warn( "THREE.WaterRefractionShader: As part of the transition to ES6 Modules, the files in 'examples/js' were deprecated in May 2020 (r117) and will be deleted in December 2020 (r124). You can find more information about developing using ES6 Modules in https://threejs.org/docs/#manual/en/introduction/Installation." );
/**
 * @author Mugen87 / https://github.com/Mugen87
 *
 */

THREE.WaterRefractionShader = {

	uniforms: {

		"color": {
			value: null
		},

		"time": {
			value: 0
		},

		"tDiffuse": {
			value: null
		},

		"tDudv": {
			value: null
		},

		"textureMatrix": {
			value: null
		}

	},

	vertexShader: [

		"uniform mat4 textureMatrix;",

		"varying vec2 vUv;",
		"varying vec4 vUvRefraction;",

		"void main() {",

		"	vUv = uv;",

		"	vUvRefraction = textureMatrix * vec4( position, 1.0 );",

		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform vec3 color;",
		"uniform float time;",
		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tDudv;",

		"varying vec2 vUv;",
		"varying vec4 vUvRefraction;",

		"float blendOverlay( float base, float blend ) {",

		"	return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );",

		"}",

		"vec3 blendOverlay( vec3 base, vec3 blend ) {",

		"	return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ),blendOverlay( base.b, blend.b ) );",

		"}",

		"void main() {",

		" float waveStrength = 0.1;",
		" float waveSpeed = 0.03;",

		// simple distortion (ripple) via dudv map (see https://www.youtube.com/watch?v=6B7IF6GOu7s)

		"	vec2 distortedUv = texture2D( tDudv, vec2( vUv.x + time * waveSpeed, vUv.y ) ).rg * waveStrength;",
		"	distortedUv = vUv.xy + vec2( distortedUv.x, distortedUv.y + time * waveSpeed );",
		"	vec2 distortion = ( texture2D( tDudv, distortedUv ).rg * 2.0 - 1.0 ) * waveStrength;",

		// new uv coords

		" vec4 uv = vec4( vUvRefraction );",
		" uv.xy += distortion;",

		"	vec4 base = texture2DProj( tDiffuse, uv );",

		"	gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );",

		"}"

	].join( "\n" )
};
